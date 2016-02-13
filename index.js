$(function() {
  $.get('sample.md', function(data) { // load sample text
    editor.session.setValue(data, -1);
    setTimeout(function() {
      window.addEventListener("hashchange", function() {
        $('.ui-layout-east').scrollTop($('.ui-layout-east').scrollTop() - 6);
      }); // a little gap to top
      if(window.location.hash.length > 0) {
        $('.ui-layout-east').scrollTop($(window.location.hash).offset().top - 30); // scroll to hash element
      }
    }, 1000);
  });
});
