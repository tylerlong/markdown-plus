var myLayout;
var editor;

$(document).ready(function () {

  myLayout = $('body').layout({
    east: {
      size: '50%',
      resizable: false,
      togglerLength_open: 0,
      spacing_open: 1,
      onresize: function(){
        // ACE的wrap貌似有问题，这里手动触发一下。
        editor.session.setUseWrapMode(false);
        editor.session.setUseWrapMode(true);
      }
    }
  });

  editor = ace.edit("editor");
  editor.$blockScrolling = Infinity;
  editor.renderer.setShowPrintMargin(false);
  editor.session.setMode("ace/mode/markdown");
  editor.session.setUseWrapMode(true);
  editor.setFontSize('14px');
  editor.focus();

  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: true
  });

  editor.session.on('change', function(){
    $('.markdown-body').html(marked(editor.session.getValue()));
    $('pre').addClass('prettyprint').addClass('linenums');
    prettyPrint();
  });

});
