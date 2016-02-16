mdc.map = true;
mdp = {
  preferencesChanged: function(){},
  loadPreferences: function() {
    var show_toolbar = Cookies.get('show-toolbar');
    if(show_toolbar == undefined) {
      show_toolbar = 'yes';
    }
    $('select#show-toolbar').val(show_toolbar);
    if(show_toolbar === 'yes') {
      layout.open('north');
    } else {
      layout.close('north');
    }

    var show_preview = Cookies.get('show-preview');
    if(show_preview == undefined) {
      show_preview = 'yes';
    }
    $('select#show-preview').val(show_preview);
    if(show_preview === 'yes') {
      layout.open('east');
    } else {
      layout.close('east');
    }

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

    var custom_css_files = Cookies.get('custom-css-files');
    if(custom_css_files == undefined) {
      custom_css_files = '';
    }
    $('textarea#custom-css-files').val(custom_css_files);
    $('link[title="customstyle"]').attr('disabled', 'disabled');
    $('link[title="customstyle"]').remove();
    custom_css_files.split('\n').forEach(function(cssfile) {
      cssfile = cssfile.trim();
      if(cssfile.length > 0) {
        $('head').append('<link rel="stylesheet" title="customstyle" href="' + cssfile + '"/>');
      }
    });
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

var lazy_change = _.debounce(function() { // user changes markdown text
  if(layout.state.east.isClosed) {
    return; // no need to update preview if panel closed
  }
  mdc.init(editor.session.getValue(), false); // realtime preview
}, 512, false);

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
var layout;
$(function() {
  layout = $('body').layout({ // create 3-panels layout
    resizerDblClickToggle: false,
    resizable: false,
    slidable: false,
    north: {
      togglerLength_open: 0,
      togglerLength_closed: 64,
      size: 'auto',
      togglerTip_closed: 'Show Toolbar',
      onopen: function() {
        editor.focus();
      },
      onclose: function() {
        editor.focus();
      }
    },
    east: {
      spacing_open: 0,
      spacing_closed: 0,
      togglerLength_open: 0,
      togglerLength_closed: 0,
      size: '50%',
      onresize: function() {
        $('article#preview').css('padding-bottom', ($('.ui-layout-east').height() - parseInt($('article#preview').css('line-height')) + 1) + 'px'); // scroll past end
      },
      onopen: function() {
        lazy_change();
        editor.focus();
      },
      onclose: function() {
        editor.focus();
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
  $(document).on('confirmation', '#preferences-modal', function() {
    ['show-toolbar', 'show-preview', 'key-binding', 'editor-font-size', 'editor-theme'].forEach(function(key) {
      Cookies.set(key, $('select#' + key).val(), { expires: 10000 });
    });
    var gantt_axis_format = $('#gantt-axis-format').val().trim();
    if(gantt_axis_format == '') {
      gantt_axis_format = '%Y-%m-%d';
    }
    Cookies.set('gantt-axis-format', gantt_axis_format, { expires: 10000 });
    var custom_css_files = $('#custom-css-files').val().trim();
    Cookies.set('custom-css-files', custom_css_files, { expires: 10000 });
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
    },
    {
      name: "bold",
      bindKey: { win: "Ctrl-B", mac: "Command-B" },
      exec: function (editor) {
        $('i.fa-bold').click();
      }
    },
    {
      name: "italic",
      bindKey: { win: "Ctrl-I", mac: "Command-I" },
      exec: function (editor) {
        $('i.fa-italic').click();
      }
    },
    {
      name: "underline",
      bindKey: { win: "Ctrl-U", mac: "Command-U" },
      exec: function (editor) {
        $('i.fa-underline').click();
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
  prompt_for_a_value('emoji', function(value) {
    if(/^:.+:$/.test(value)) {
      value = /^:(.+):$/.exec(value)[1];
    }
    editor.insert(':' + value + ':');
  });

  // Font Awesome icon
  prompt_for_a_value('fa', function(value) {
    if(value.substring(0, 3) == 'fa-') {
      value = value.substring(3);
    }
    editor.insert(':fa-' + value + ':');
  });

  // Ionicons icon
  prompt_for_a_value('ion', function(value) {
    if(value.substring(0, 4) == 'ion-') {
      value = value.substring(4);
    }
    editor.insert(':ion-' + value + ':');
  });

  $('#math-icon').click(function() {
    var text = editor.session.getTextRange(editor.selection.getRange()).trim();
    if(text.length == 0) {
      text = $(this).data('sample');;
    }
    editor.insert('\n```math\n' + text + '\n```\n');
    editor.focus();
  });

  $('.mermaid-icon').click(function() {
    var text = editor.session.getTextRange(editor.selection.getRange()).trim();
    if(text.length == 0) {
      text = $(this).data('sample');
    }
    editor.insert('\n```\n' + text + '\n```\n');
    editor.focus();
  });

  $('.toggle-icon').click(function() {
    var direction = $(this).data('direction');
    layout.toggle(direction);
  });
});
