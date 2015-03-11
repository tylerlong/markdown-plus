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
  editor.getSession().setMode("ace/mode/markdown");
  editor.renderer.setShowPrintMargin(false);
});
