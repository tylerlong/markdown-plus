var editor;

$(document).ready(function() {

  // 构造上中右三个面板
  $('body').layout({
    resizerDblClickToggle: false,
    resizable: false,
    slidable: false,
    togglerLength_open: '100%',
    togglerLength_closed: '100%',
    north: {
      size: '1px', // 只是占位，真实大小由内容决定
      togglerTip_open: 'Hide Toolbar',
      togglerTip_closed: 'Show Toolbar'
    },
    east: {
      size: '50%',
      togglerTip_open: 'Hide Preview',
      togglerTip_closed: 'Show Preview',
      onresize: function() {
        editor.session.setUseWrapMode(false); // ACE的wrap貌似有问题，这里手动触发一下。
        editor.session.setUseWrapMode(true);
      }
    }
  });

  // 左侧编辑器
  editor = ace.edit("editor");
  editor.$blockScrolling = Infinity;
  editor.renderer.setShowPrintMargin(false);
  editor.session.setMode("ace/mode/markdown");
  editor.session.setUseWrapMode(true);
  editor.setFontSize('14px');
  editor.focus();

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
    var checkbox = $('<input type="checkbox" class="taskbox" disabled="disabled"/>');
    if(/^\[x\]\s/.test(text)) { // 完成的任务列表
      checkbox.attr('checked', true);
    }
    return $(marked.Renderer.prototype.listitem(text.substring(4))).addClass('none-style').prepend(checkbox)[0].outerHTML;
  }
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: true
  });

  // 实时监听用户的编辑
  // todo: 改成underscore debounce方法来减少执行次数、提升性能？
  editor.session.on('change', function() {
    $('.markdown-body').empty().append(marked(editor.session.getValue())); // 实时预览
    $('pre').addClass('prettyprint').addClass('linenums');
    prettyPrint(); // 语法高亮
    $('img[src^="emoji/"]').each(function() { // 转换emoji路径
      $(this).attr('src', 'bower_components/emoji-icons/' + $(this).attr('src').substring(6) + '.png');
    });
  });

  // h1 - h6 heading
  $('.heading-icon').click(function() {
    var level = $(this).data('level');
    var p = editor.getCursorPosition();
    p.column += level + 1; // 光标位置会产生偏移
    editor.navigateLineStart();
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
      editor.navigateLineEnd();
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

  // link icon
  $('#link-icon').click(function() {
    var range = editor.selection.smartRange();
    var text = editor.session.getTextRange(range);
    if(text.trim().length == 0) {
      text = 'link description';
    }
    editor.session.replace(range, '[' + text +'](http://example.com/ "optional title")');
    editor.focus();
  });

  // image icon
  $('#image-icon').click(function() {
    var range = editor.selection.getRange();
    var text = editor.session.getTextRange(range).trim();
    if(text.length == 0) {
      text = 'image description';
    }
    editor.insert('![' + text + '](http://example.com/example.png)');
    editor.focus();
  });

  // code icon
  $('#code-icon').click(function() {
    var range = editor.selection.getRange();
    var text = editor.session.getTextRange(range).trim();
    if(text.length == 0) {
      text = 'enter code here';
    }
    editor.insert('\n```\n' + text + '\n```\n');
    editor.focus();
  });

  // table icon
  $('#table-icon').click(function() {
    var tableTemplate = 'header 1 | header 2\n---|---\nrow 1 col 1 | row 1 col 2\nrow 2 col 1 | row 2 col 2';
    editor.insert(''); // 删除选中的部分
    var p = editor.getCursorPosition();
    if(p.column == 0) { // 光标在行首
      editor.navigateLineStart();
      editor.insert('\n' + tableTemplate + '\n\n');
    } else {
      editor.navigateLineEnd();
      editor.insert('\n\n' + tableTemplate + '\n');
    }
    editor.focus();
  });

  // emoji icon
  $(document).on('confirm', '#emoji-modal', function() {
    var emoji_code = $('#emoji-code').val().trim();
    if(emoji_code.length > 0) {
      editor.insert('<img src="emoji/' + emoji_code + '" width="18"/>');
    }
  });
  $(document).on('opened', '#emoji-modal', function() {
    $('#emoji-code').focus();
  });
  $('#emoji-modal').keyup(function(e) {
   if(e.which == 13) {
      $('#emoji-confirm').click();
    }
  });

  // modals
  $(document).on('close', '.remodal', function(e) {
    editor.focus();
  });

});
