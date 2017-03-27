require('./index.css')

import $ from 'jquery'
window.$ = window.jQuery = $

// load sample text and get anchor links correct
$(() => {
  const editor = require('./editor')
  require('./init')
  require('./preferences')
  $.get('sample.md', (data) => {
    editor.session.setValue(data, -1)
    setTimeout(() => {
      // a little gap to top
      window.addEventListener('hashchange', () => {
        $('.ui-layout-east').scrollTop($('.ui-layout-east').scrollTop() - 6)
      })

      // scroll to hash element
      if (window.location.hash.length > 0) {
        $('.ui-layout-east').scrollTop($(window.location.hash).offset().top - 30)
      }
    }, 1000)
  })
})
