import $ from 'jquery'

$(() => {
  $.get('sample.md', (data) => { // load sample text
    window.editor.session.setValue(data, -1)
    setTimeout(() => {
      window.addEventListener('hashchange', () => {
        $('.ui-layout-east').scrollTop($('.ui-layout-east').scrollTop() - 6)
      }) // a little gap to top
      if (window.location.hash.length > 0) {
        $('.ui-layout-east').scrollTop($(window.location.hash).offset().top - 30) // scroll to hash element
      }
    }, 1000)
  })
})
