String.prototype.repeat = function(i) { // Some browsers don't support repeat, for example, Safari
    return new Array(i + 1).join(this);
}

function prompt_for_a_value(key, action) {
  $(document).on('opened', '#' + key + '-modal', function() {
    $('#' + key + '-code').focus();
  });
  $('#' + key + '-code').keyup(function(e) {
   if(e.which == 13) { // press enter to confirm
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
// modals
$(document).on('close', '.remodal', function(e) {
  editor.focus();
});

function get_editor_scroll() { // 获取编辑器的滚动位置
  var line_markers = $('.ui-layout-east article > [data-source-line]');
  var lines = []; // 逻辑行
  line_markers.each(function() {
    lines.push($(this).data('source-line'));
  });
  var pLines = []; // 物理行
  var pLine = 0;
  for(var i = 0; i < lines[lines.length - 1]; i++) {
    if($.inArray(i + 1, lines) !== -1) {
      pLines.push(pLine);
    }
    pLine += editor.session.getRowLength(i) // 因为有wrap，所以行高未必是1
  }
  var currentLine = editor.session.getScrollTop() / editor.renderer.lineHeight; // 当前滚动到的物理行
  var lastMarker = false;
  var nextMarker = false;
  for(var i = 0; i < pLines.length; i++) {
    if(pLines[i] < currentLine) {
      lastMarker = i;
    } else {
      nextMarker = i;
      break;
    }
  } // 当前滚动到了哪两个marker中间
  var lastLine = 0;
  var nextLine = editor.session.getScreenLength() - 1; // 最后一个物理行的顶部，所以 -1
  if(lastMarker !== false) {
    lastLine = pLines[lastMarker];
  }
  if(nextMarker !== false) {
    nextLine = pLines[nextMarker];
  } // 前后两个marker的物理行
  var percentage = 0;
  if(nextLine !== lastLine) { // 行首的情况下可能相等，0 不能作为除数
    percentage = (currentLine - lastLine) / (nextLine - lastLine);
  } // 当前位置在两个marker之间所处的百分比
  // 返回的是前后两个marker对应的逻辑行，以及当前位置在前后两个marker之间所处的百分比
  return { lastMarker: lines[lastMarker], nextMarker: lines[nextMarker], percentage: percentage };
}

function set_preview_scroll(editor_scroll) { // 设置预览的滚动位置
  var lastPosition = 0;
  var nextPosition = $('.ui-layout-east article').outerHeight() - $('.ui-layout-east').height(); // 这是总共可以scroll的最大幅度
  if(editor_scroll.lastMarker !== undefined) { // 最开始的位置没有marker
    lastPosition = $('.ui-layout-east article').find('>[data-source-line="' + editor_scroll.lastMarker + '"]').get(0).offsetTop;
  }
  if(editor_scroll.nextMarker !== undefined) { // 最末尾的位置没有marker
    nextPosition = $('.ui-layout-east article').find('>[data-source-line="' + editor_scroll.nextMarker + '"]').get(0).offsetTop;
  } // 查找出前后两个marker在页面上所处的滚动距离
  scrollPosition = lastPosition + (nextPosition - lastPosition) * editor_scroll.percentage; // 按照左侧的百分比计算出右侧应该滚动到的位置
  $('.ui-layout-east').animate({scrollTop: scrollPosition}, 32); // 加一点动画效果
}

var sync_preview = _.debounce(function() { // sync right with left
  set_preview_scroll(get_editor_scroll());
}, 32, false);

var lazy_change = _.debounce(function() { // user changes markdown text
  mdc.init(editor.session.getValue(), false); // realtime preview
  sync_preview();
}, 256, false);

var Vim = ace.require("ace/keyboard/vim").CodeMirror.Vim // vim commands
Vim.defineEx("write", "w", function(cm, input) {
  console.log('write');
});
Vim.defineEx("quit", "q", function(cm, input) {
  if(input.input === 'q') {
    console.log('quit');
  } else if(input.input === 'q!') {
    console.log('quit without warning');
  }
});
Vim.defineEx("wq", "wq", function(cm, input) {
  console.log('write then quit');
});

var editor;
$(function() {
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
      togglerTip_closed: $('#preview').data('closed-title'),
      onresize: function() {
        $('.markdown-body').css('padding-bottom', ($('.ui-layout-east').height() - parseInt($('.markdown-body').css('line-height')) + 1) + 'px'); // scroll past end
      }
    },
    center: {
      onresize: function() {
        editor.session.setUseWrapMode(false); // fix ACE editor text wrap issue
        editor.session.setUseWrapMode(true);
      }
    }
  });

  $('.markdown-body').css('padding-bottom', ($('.ui-layout-east').height() - parseInt($('.markdown-body').css('line-height')) + 1) + 'px'); // scroll past end

  // editor on the left
  editor = ace.edit("editor");
  editor.session.setUseWorker(false);
  editor.$blockScrolling = Infinity;
  editor.renderer.setShowPrintMargin(false);
  editor.session.setMode('ace/mode/markdown');
  editor.session.setUseWrapMode(true);
  editor.setScrollSpeed(1);
  editor.setOption("scrollPastEnd", true);
  editor.session.setFoldStyle('manual');
  editor.focus();
  editor.session.on('changeScrollTop', function(scroll) {
    sync_preview();
  });

  // load preferences
  var key_binding = Cookies.get('key-binding');
  if(key_binding == undefined) {
    key_binding = 'default'
  }
  $('select#key-binding').val(key_binding);
  if(key_binding !== 'default') {
    editor.setKeyboardHandler(ace.require("ace/keyboard/" + key_binding).handler);
  }

  var font_size = Cookies.get('editor-font-size');
  if(font_size == undefined) {
    font_size = '14';
  }
  $('select#editor-font-size').val(font_size);
  editor.setFontSize(font_size + 'px');

  var editor_theme = Cookies.get('editor-theme');
  if(editor_theme == undefined) {
    editor_theme = 'tomorrow_night_eighties';
  }
  $('select#editor-theme').val(editor_theme);
  editor.setTheme('ace/theme/' + editor_theme);

  // change preferences
  $('select#key-binding').change(function() {
    var key_binding = $(this).val();
    Cookies.set('key-binding', key_binding, { expires: 10000 });
    if(key_binding == 'default') {
      editor.setKeyboardHandler(null);
    } else {
      editor.setKeyboardHandler(ace.require("ace/keyboard/" + key_binding).handler);
    }
  });

  $('select#editor-font-size').change(function() {
    var font_size = $(this).val();
    Cookies.set('editor-font-size', font_size, { expires: 10000 });
    editor.setFontSize(font_size + 'px');
  });

  $('select#editor-theme').change(function() {
    var editor_theme = $(this).val();
    Cookies.set('editor-theme', editor_theme, { expires: 10000 });
    editor.setTheme('ace/theme/' + editor_theme);
  });

  // extension methods for editor
  editor.selection.smartRange = function() {
    var range = editor.selection.getRange();
    if(!range.isEmpty()) {
      return range; // return what user selected
    }
    // nothing was selected
    var _range = range; // backup original range
    range = editor.selection.getWordRange(range.start.row, range.start.column); // range for current word
    if(editor.session.getTextRange(range).trim().length == 0) { // selected is blank
      range = _range; // restore original range
    }
    return range;
  };

  // overwrite some ACE editor keyboard shortcuts
  editor.commands.addCommands([
    {
      name: "preferences",
      bindKey: { win: "Ctrl-,", mac: "Command-," },
      exec: function (editor) {
        $('i.fa-cog').click(); // show M+ preferences modal
      }
    }
  ]);

  // whenever user changes markdown...
  editor.session.on('change', function() {
    lazy_change();
  });

  // h1 - h6 heading
  $('.heading-icon').click(function() {
    var level = $(this).data('level');
    var p = editor.getCursorPosition();
    p.column += level + 1; // 光标位置会产生偏移
    editor.navigateTo(editor.getSelectionRange().start.row, 0); // navigateLineStart 在 wrap 的时候有问题
    editor.insert('#'.repeat(level) + ' ');
    editor.moveCursorToPosition(p); // restore cursor position
    editor.focus();
  });

  // styling icons
  $('.styling-icon').click(function() {
    var modifier = $(this).data('modifier');
    var range = editor.selection.smartRange();
    var p = editor.getCursorPosition();
    p.column += modifier.length; // 光标位置会产生偏移
    editor.session.replace(range, modifier + editor.session.getTextRange(range) + modifier);
    editor.moveCursorToPosition(p); // restore cursor position
    editor.selection.clearSelection(); // 不知为何上一个语句会选中一部分文字
    editor.focus();
  });

  // <hr/>
  $('#horizontal-rule').click(function() {
    var p = editor.getCursorPosition();
    if(p.column == 0) { // cursor is at line start
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
    editor.moveCursorToPosition(p); // restore cursor position
    editor.focus();
  });

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
    editor.insert('\n```\n' + text + '\n```\n');
    editor.focus();
    editor.navigateUp(2);
    editor.navigateLineEnd();
  });

  $('#table-icon').click(function() {
    var sample = $(this).data('sample');
    editor.insert(''); // delete selected
    var p = editor.getCursorPosition();
    if(p.column == 0) { // cursor is at line start
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
    if(/^:.+:$/.test(value)) {
      value = /^:(.+):$/.exec(value)[1];
    }
    editor.insert(':' + value + ':');
  });

  // Font Awesome icon
  prompt_for_a_value('fa', function(value){
    if(value.substring(0, 3) == 'fa-') {
      value = value.substring(3);
    }
    editor.insert(':fa-' + value + ':');
  });

  // Ionicons icon
  prompt_for_a_value('ion', function(value){
    if(value.substring(0, 4) == 'ion-') {
      value = value.substring(4);
    }
    editor.insert(':ion-' + value + ':');
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
});
