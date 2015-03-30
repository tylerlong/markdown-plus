String.prototype.repeat = function(i) { // Some browsers don't support repeat, for example, Safari
    return new Array(i + 1).join(this);
}

var mermaid_config = {
  htmlLabels: false // fix mermaid flowchart IE issue
};
mermaid.ganttConfig = { // Configuration for Gantt diagrams
  numberSectionStyles:4,
  axisFormatter: [
      ["%I:%M", function (d) { // Within a day
          return d.getHours();
      }],
      ["w. %U", function (d) { // Monday a week
          return d.getDay() == 1;
      }],
      ["%a %d", function (d) { // Day within a week (not monday)
          return d.getDay() && d.getDate() != 1;
      }],
      ["%b %d", function (d) { // within a month
          return d.getDate() != 1;
      }],
      ["%m-%y", function (d) { // Month
          return d.getMonth();
      }]
  ]
};

// synchronize preview scrolling
function sync_preview(scroll) {
  var percentage = scroll / (editor.session.getScreenLength() * editor.renderer.lineHeight - $('#editor').height());
  var scrollTop = ($('.ui-layout-east article').outerHeight() - $('.ui-layout-east').height()) * percentage;
  $('.ui-layout-east').scrollTop(scrollTop);
}

// vim commands
// todo: need some test
var VimApi = ace.require("ace/keyboard/vim").CodeMirror.Vim
VimApi.defineEx("write", "w", function(cm, input) {
  $('.file-icon[data-name="save"]').click();
  console.log('write');
});
VimApi.defineEx("quit", "q", function(cm, input) {
  if(input.input == 'q') {
    console.log('quit');
  } else if(input.input == 'q!') {
    console.log('quit without warning');
  }
});
VimApi.defineEx("wq", "wq", function(cm, input) {
  console.log('write then quit');
});

var editor;
$(document).ready(function() {
  $('body').layout({ // create 3-panels layout
    resizerDblClickToggle: false,
    resizable: false,
    slidable: false,
    togglerLength_open: '100%',
    togglerLength_closed: '100%',
    north: {
      size: 'auto',
      togglerTip_open: $('#toolbar').data('open-title'),
      togglerTip_closed: $('#toolbar').data('closed-title')
    },
    east: {
      size: '50%',
      togglerTip_open: $('#preview').data('open-title'),
      togglerTip_closed: $('#preview').data('closed-title')
    },
    center: {
      onresize: function() {
        editor.session.setUseWrapMode(false); // ACE的wrap貌似有问题，这里手动触发一下。
        editor.session.setUseWrapMode(true);
      }
    }
  });

  // editor on the left
  editor = ace.edit("editor");
  editor.$blockScrolling = Infinity;
  editor.renderer.setShowPrintMargin(false);
  editor.session.setMode('ace/mode/markdown');
  editor.setTheme('ace/theme/tomorrow');
  editor.session.setUseWrapMode(true);
  editor.setFontSize('14px');
  editor.focus();
  editor.session.on('changeScrollTop', function(scroll) {
    sync_preview(scroll);
  });

  // load preferences
  var vim_mode = $.cookie('vim-mode') == 'true';
  if(vim_mode) {
    $('#vim-checkbox').prop('checked', true);
    editor.setKeyboardHandler(ace.require("ace/keyboard/vim").handler);
  }

  // 编辑器的一些拓展方法
  editor.selection.smartRange = function() {
    var range = editor.selection.getRange();
    if(!range.isEmpty()) {
      return range; // 用户手动选中了一些文字，直接用这个
    }
    // 没有选中任何东西
    var _range = range; // 备份原始range
    range = editor.selection.getWordRange(range.start.row, range.start.column); // 当前单词的range
    if(editor.session.getTextRange(range).trim().length == 0) { // 选中的东西是空或者全空白
      range = _range; // 还使用原始的range
    }
    return range;
  };

  // 设置marked
  var renderer = new marked.Renderer();
  renderer.listitem = function(text) {
    if(!/^\[[ x]\]\s/.test(text)) {
      return marked.Renderer.prototype.listitem(text);
    }
    // 任务列表
    var checkbox = $('<input type="checkbox" disabled/>');
    if(/^\[x\]\s/.test(text)) { // 完成的任务列表
      checkbox.attr('checked', true);
    }
    return $(marked.Renderer.prototype.listitem(text.substring(3))).addClass('task-list-item').prepend(checkbox)[0].outerHTML;
  }
  var mermaidError;
  mermaid.parseError = function(err, hash){
    mermaidError = err;
  };
  renderer.code = function(code, language) {
    code = code.trim();
    var firstLine = code.split(/\n/)[0].trim();
    if(language === 'math') { // 数学公式
      var tex = '';
      code.split(/\n\n/).forEach(function(line){ // 连续两个换行，则开始下一个公式
        line = line.trim();
        if(line.length > 0) {
          try {
            tex += katex.renderToString(line, { displayMode: true });
          } catch(err) {
            tex += '<pre>' + err + '</pre>';
          }
        }
      });
      return tex;
    } else if(firstLine === 'gantt' || firstLine === 'sequenceDiagram' || firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) { // mermaid
      if(firstLine === 'sequenceDiagram') {
        code += '\n'; // 如果末尾没有空行，则语法错误
      }
      if(mermaid.parse(code)) {
        return '<div class="mermaid">' + code + '</div>';
      } else {
        return '<pre>' + mermaidError + '</pre>';
      }
    } else {
      return marked.Renderer.prototype.code.apply(this, arguments);
    }
  }
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: true
  });

  // 实时监听用户的编辑
  editor.session.on('change', function() {
    lazy_change();
  });
  var modelist = ace.require('ace/ext/modelist').modesByName;
  var highlight = ace.require('ace/ext/static_highlight');
  var lazy_change = _.debounce(function() { // 用户停止输入128毫秒之后才会触发
    $('.markdown-body').empty().append(marked(editor.session.getValue())); // realtime preview
    $('code').each(function(){ // code highlight
      var language = ($(this).attr('class') || 'lang-c_cpp').substring(5).toLowerCase();
      if(modelist[language] == undefined) {
        language = 'c_cpp';
      }
      highlight($(this)[0], {
          mode: 'ace/mode/' + language,
          theme: 'ace/theme/github',
          startLineNumber: 1,
          showGutter: false,
          trim: true,
      }, function (highlighted) {});
    });
    $('img[src^="emoji/"]').each(function() { // 转换emoji路径
      $(this).attr('src', 'bower_components/emoji-icons/' + $(this).attr('src').substring(6) + '.png');
    });
    mermaid.init(); // generate flowcharts, sequence diagrams, gantt diagrams...etc.
    $('line[y2="2000"]').each(function(){ // a temp workaround for mermaid bug: https://github.com/knsv/mermaid/issues/142
      $(this).attr('y2', $(this).closest('svg').attr('height') - 10);
    });
    sync_preview(editor.session.getScrollTop());
  }, 128, false);

  // h1 - h6 heading
  $('.heading-icon').click(function() {
    var level = $(this).data('level');
    var p = editor.getCursorPosition();
    p.column += level + 1; // 光标位置会产生偏移
    editor.navigateTo(editor.getSelectionRange().start.row, 0); // navigateLineStart 在 wrap 的时候有问题
    editor.insert('#'.repeat(level) + ' ');
    editor.moveCursorToPosition(p); // 恢复光标位置
    editor.focus();
  });

  // styling icons
  $('.styling-icon').click(function() {
    var modifier = $(this).data('modifier');
    var range = editor.selection.smartRange();
    var p = editor.getCursorPosition();
    p.column += modifier.length; // 光标位置会产生偏移
    editor.session.replace(range, modifier + editor.session.getTextRange(range) + modifier);
    editor.moveCursorToPosition(p); // 恢复光标位置
    editor.selection.clearSelection(); // 不知为何上一个语句会选中一部分文字
    editor.focus();
  });

  // <hr/>
  $('#horizontal-rule').click(function() {
    var p = editor.getCursorPosition();
    if(p.column == 0) { // 光标在行首
      editor.selection.clearSelection();
      editor.insert('\n---\n');
    } else {
      editor.navigateTo(editor.getSelectionRange().start.row, Number.MAX_VALUE); // navigateLineEnd 在 wrap 的时候有问题
      editor.insert('\n\n---\n');
    }
    editor.focus();
  });

  // list icons
  $('.list-icon').click(function() {
    var prefix = $(this).data('prefix');
    var p = editor.getCursorPosition();
    p.column += prefix.length; // 光标位置会产生偏移
    var range = editor.selection.getRange();
    for(var i = range.start.row + 1; i < range.end.row + 2; i++) {
      editor.gotoLine(i);
      editor.insert(prefix);
    }
    editor.moveCursorToPosition(p); // 恢复光标位置
    editor.focus();
  });

  // todo: link 和 image 采用 modal 的方式让用户输入
  $('#link-icon').click(function() {
    var range = editor.selection.smartRange();
    var text = editor.session.getTextRange(range);
    if(text.trim().length == 0) {
      text = $(this).data('sample-text');
    }
    var url = $(this).data('sample-url');
    editor.session.replace(range, '[' + text + '](' + url + ')');
    editor.focus();
  });

  $('#image-icon').click(function() {
    var text = editor.session.getTextRange(editor.selection.getRange()).trim();
    if(text.length == 0) {
      text = $(this).data('sample-text');
    }
    var url = $(this).data('sample-url')
    editor.insert('![' + text + '](' + url + ')');
    editor.focus();
  });

  $('#code-icon').click(function() {
    var text = editor.session.getTextRange(editor.selection.getRange()).trim();
    if(text.length == 0) {
      text = $(this).data('sample');
    }
    editor.insert('\n```\n' + text + '\n```\n');
    editor.focus();
  });

  $('#table-icon').click(function() {
    var sample = $(this).data('sample');
    editor.insert(''); // 删除选中的部分
    var p = editor.getCursorPosition();
    if(p.column == 0) { // 光标在行首
      editor.selection.clearSelection();
      editor.insert('\n' + sample + '\n\n');
    } else {
      editor.navigateTo(editor.getSelectionRange().start.row, Number.MAX_VALUE);
      editor.insert('\n\n' + sample + '\n');
    }
    editor.focus();
  });

  // emoji icon
  prompt_for_a_value('emoji', function(value){
    editor.insert('<img src="emoji/' + value + '" width="18"/>');
  });

  // Font Awesome icon
  prompt_for_a_value('fa', function(value){
    editor.insert('<i class="fa fa-' + value + '"/>');
  });

  // Ionicons icon
  prompt_for_a_value('ion', function(value){
    editor.insert('<i class="icon ion-' + value + '"/>');
  });

  $('#math-icon').click(function(){
    var text = editor.session.getTextRange(editor.selection.getRange()).trim();
    if(text.length == 0) {
      text = $(this).data('sample');;
    }
    editor.insert('\n```math\n' + text + '\n```\n');
    editor.focus();
  });

  $('.mermaid-icon').click(function(){
    var text = editor.session.getTextRange(editor.selection.getRange()).trim();
    if(text.length == 0) {
      text = $(this).data('sample');
    }
    editor.insert('\n```\n' + text + '\n```\n');
    editor.focus();
  });

  // Preferences
  $('#vim-checkbox').change(function() {
    if($(this).is(':checked')) {
      $.cookie('vim-mode', true, { expires: 10000 });
      editor.setKeyboardHandler(ace.require("ace/keyboard/vim").handler);
    } else {
      $.cookie('vim-mode', false, { expires: 10000 });
      editor.setKeyboardHandler(null);
    }
  });

  // modals
  $(document).on('close', '.remodal', function(e) {
    editor.focus(); // 关闭modal，编辑器自动获得焦点
  });
});

function prompt_for_a_value(key, action) {
  $(document).on('opened', '#' + key + '-modal', function() {
    $('#' + key + '-code').focus();
  });
  $('#' + key + '-code').keyup(function(e) {
   if(e.which == 13) { // 回车键确认
      $('#' + key + '-confirm').click();
    }
  });
  $(document).on('confirm', '#' + key + '-modal', function() {
    var value = $('#' + key + '-code').val().trim();
    if(value.length > 0) {
      action(value);
      $('#' + key + '-code').val('');
    }
  });
}
