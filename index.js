$(document).ready(function () {

  var myLayout = $('body').layout({
    east: {
      size: '50%',
      resizable: false,
      togglerLength_open: 0,
      spacing_open: 1
    }
  });

  var editor = ace.edit("editor");
  editor.$blockScrolling = Infinity;
  editor.getSession().setMode("ace/mode/markdown");
  editor.renderer.setShowPrintMargin(false);

  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  });

  editor.session.on('change', function(){
    $('.ui-layout-east').html(marked(editor.session.getValue()));
  });

});
