$(function(){
  $.get('sample.md', function(data) { // load sample text
    editor.session.setValue(data, -1);
  });
});
