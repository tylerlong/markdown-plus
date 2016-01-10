mdc.map = true;
mdp = {
  preferencesChanged: function(){},
  loadPreferences: function() {
    var key_binding = Cookies.get('key-binding');
    if(key_binding == undefined) {
      key_binding = 'default';
    }
    $('select#key-binding').val(key_binding);
    if(key_binding == 'default') {
      editor.setKeyboardHandler(null);
    } else {
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

    var mdcPreferences = mdc.loadPreferences();
    $('input#gantt-axis-format').val(mdcPreferences['gantt-axis-format']);
  }
};

function prompt_for_a_value(key, action) {
  $(document).on('opened', '#' + key + '-modal', function() {
    $('#' + key + '-code').focus();
  });
  $('#' + key + '-code').keyup(function(e) {
   if(e.which == 13) { // press enter to confirm
      $('#' + key + '-confirm').click();
    }
  });
  $(document).on('confirmation', '#' + key + '-modal', function() {
    var value = $('#' + key + '-code').val().trim();
    if(value.length > 0) {
      action(value);
      $('#' + key + '-code').val('');
    }
  });
}
// modals
$(document).on('closed', '.remodal', function(e) {
  editor.focus();
});

function get_editor_scroll() {
  var line_markers = $('article#preview > [data-source-line]');
  var lines = []; // logical line
  line_markers.each(function() {
    lines.push($(this).data('source-line'));
  });
  var pLines = []; // physical line
  var pLine = 0;
  for(var i = 0; i < lines[lines.length - 1]; i++) {
    if($.inArray(i + 1, lines) !== -1) {
      pLines.push(pLine);
    }
    pLine += editor.session.getRowLength(i); // line height might not be 1 because of wrap
  }
  var currentLine = editor.session.getScrollTop() / editor.renderer.lineHeight; // current physical line
  var lastMarker = false;
  var nextMarker = false;
  for(var i = 0; i < pLines.length; i++) {
    if(pLines[i] < currentLine) {
      lastMarker = i;
    } else {
      nextMarker = i;
      break;
    }
  } // between last marker and next marker
  var lastLine = 0;
  var nextLine = editor.session.getScreenLength() - 1; // on the top of last physical line, so -1
  if(lastMarker !== false) {
    lastLine = pLines[lastMarker];
  }
  if(nextMarker !== false) {
    nextLine = pLines[nextMarker];
  } // physical lines of two neighboring markers
  var percentage = 0;
  if(nextLine !== lastLine) { // at the beginning of file, equal, but cannot divide by 0
    percentage = (currentLine - lastLine) / (nextLine - lastLine);
  } // scroll percentage between two markers
  // returns two neighboring markers' logical lines, and current scroll percentage between two markers
  return { lastMarker: lines[lastMarker], nextMarker: lines[nextMarker], percentage: percentage };
}

function set_preview_scroll(editor_scroll) {
  var lastPosition = 0;
  var nextPosition = $('article#preview').outerHeight() - $('.ui-layout-east').height(); // maximum scroll
  if(editor_scroll.lastMarker !== undefined) { // no marker at very start
    lastPosition = $('article#preview').find('>[data-source-line="' + editor_scroll.lastMarker + '"]').get(0).offsetTop;
  }
  if(editor_scroll.nextMarker !== undefined) { // no marker at very end
    nextPosition = $('article#preview').find('>[data-source-line="' + editor_scroll.nextMarker + '"]').get(0).offsetTop;
  }
  var scrollTop = lastPosition + (nextPosition - lastPosition) * editor_scroll.percentage; // right scroll according to left percentage
  scrollRight(scrollTop);
}

var sync_preview = _.debounce(function() { // sync right with left
  set_preview_scroll(get_editor_scroll());
}, 64, false);





mdp.scrollingSide = null;
var timeoutHandle = null;
function scrollSide(scrollTop, side) {
  if(mdp.scrollingSide != null && mdp.scrollingSide != side) {
    return; // the other side hasn't finished scrolling
  }
  mdp.scrollingSide = side
  clearTimeout(timeoutHandle);
  timeoutHandle = setTimeout(function(){ mdp.scrollingSide = null; }, 512);
  if(side === 'left') {
    editor.session.setScrollTop(scrollTop);
  } else if (side === 'right') {
    $('.ui-layout-east').animate({ scrollTop: scrollTop }, 64);
  } else { // impossible
    return;
  }
}
function scrollLeft(scrollTop){ scrollSide(scrollTop, 'left'); }
function scrollRight(scrollTop){ scrollSide(scrollTop, 'right'); }





function get_preview_scroll() {
  var scroll = $('.ui-layout-east').scrollTop();
  var lastMarker = false;
  var nextMarker = false;
  var line_markers = $('article#preview > [data-source-line]');
  for(var i = 0; i < line_markers.length; i++) {
    if(line_markers[i].offsetTop < scroll) {
      lastMarker = i;
    } else {
      nextMarker = i;
      break;
    }
  }
  var lastLine = 0;
  var nextLine = $('article#preview').outerHeight() - $('.ui-layout-east').height(); // 这是总共可以scroll的最大幅度
  if(lastMarker !== false) {
    lastLine = line_markers[lastMarker].offsetTop;
  }
  if(nextMarker !== false) {
    nextLine = line_markers[nextMarker].offsetTop;
  }
  var percentage = 0;
  if(nextLine !== lastLine) {
    percentage = (scroll - lastLine) / (nextLine - lastLine);
  }
  return { lastMarker: lastMarker, nextMarker: nextMarker, percentage: percentage }; // 返回的是前后两个marker的编号，以及当前位置在前后两个marker之间所处的百分比
}

function set_editor_scroll(preview_scroll) {
  var line_markers = $('article#preview > [data-source-line]');
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
  var lastLine = 0;
  var nextLine = editor.session.getScreenLength() - 1; // 最后一个物理行的顶部
  if(preview_scroll.lastMarker !== false) {
    lastLine = pLines[preview_scroll.lastMarker]
  }
  if(preview_scroll.nextMarker !== false) {
    nextLine = pLines[preview_scroll.nextMarker]
  }
  var scrollTop = ((nextLine - lastLine) * preview_scroll.percentage + lastLine) * editor.renderer.lineHeight;
  // editor.session.setScrollTop(scrollTop);
  scrollLeft(scrollTop);
}

var sync_editor = _.debounce(function() { // sync left with right
  set_editor_scroll(get_preview_scroll());
}, 64, false);





var lazy_change = _.debounce(function() { // user changes markdown text
  mdc.init(editor.session.getValue(), false); // realtime preview
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
      togglerTip_open: 'Hide Toolbar',
      togglerTip_closed: 'Show Toolbar'
    },
    east: {
      size: '50%',
      togglerTip_open: 'Hide Preview',
      togglerTip_closed: 'Show Preview',
      onresize: function() {
        $('article#preview').css('padding-bottom', ($('.ui-layout-east').height() - parseInt($('article#preview').css('line-height')) + 1) + 'px'); // scroll past end
      }
    },
    center: {
      onresize: function() {
        editor.session.setUseWrapMode(false); // fix ACE editor text wrap issue
        editor.session.setUseWrapMode(true);
      }
    }
  });

  $('article#preview').css('padding-bottom', ($('.ui-layout-east').height() - parseInt($('article#preview').css('line-height')) + 1) + 'px'); // scroll past end

  $('.ui-layout-east').scroll(function() { // left scroll with right
    sync_editor();
  });

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
    sync_preview(); // right scroll with left
  });

  // load preferences
  mdp.loadPreferences();

  // change preferences
  $.each(['key-binding', 'editor-font-size', 'editor-theme'], function(index, key) {
      $('select#' + key).change(function() {
          Cookies.set(key, $(this).val(), { expires: 10000 });
          mdp.loadPreferences();
      });
  });
  $('#gantt-axis-format').keyup(_.debounce(function() {
      Cookies.set('gantt-axis-format', $('#gantt-axis-format').val(), { expires: 10000 });
  }, 500));
  $(document).on('confirmation', '#preferences-modal', function() {
    var gantt_axis_format = $('#gantt-axis-format').val().trim();
    if(gantt_axis_format == '') {
      gantt_axis_format = '%-m/%-d';
    }
    Cookies.set('gantt-axis-format', gantt_axis_format, { expires: 10000 });
    mdp.loadPreferences();
    lazy_change(); // trigger re-render
    mdp.preferencesChanged();
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
    p.column += level + 1; // cursor offset
    editor.navigateTo(editor.getSelectionRange().start.row, 0); // navigateLineStart has issue when there is wrap
    editor.insert('#'.repeat(level) + ' ');
    editor.moveCursorToPosition(p); // restore cursor position
    editor.focus();
  });

  // styling icons
  $('.styling-icon').click(function() {
    var modifier = $(this).data('modifier');
    var range = editor.selection.smartRange();
    var p = editor.getCursorPosition();
    p.column += modifier.length; // cursor offset
    editor.session.replace(range, modifier + editor.session.getTextRange(range) + modifier);
    editor.moveCursorToPosition(p); // restore cursor position
    editor.selection.clearSelection(); // don't know why statement above selects some text
    editor.focus();
  });

  // <hr/>
  $('#horizontal-rule').click(function() {
    var p = editor.getCursorPosition();
    if(p.column == 0) { // cursor is at line start
      editor.selection.clearSelection();
      editor.insert('\n---\n');
    } else {
      editor.navigateTo(editor.getSelectionRange().start.row, Number.MAX_VALUE); // navigateLineEnd has issue when there is wrap
      editor.insert('\n\n---\n');
    }
    editor.focus();
  });

  // list icons
  $('.list-icon').click(function() {
    var prefix = $(this).data('prefix');
    var p = editor.getCursorPosition();
    p.column += prefix.length; // cursor offset
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
