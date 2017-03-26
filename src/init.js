import $ from 'jquery'
import Cookies from 'js-cookie'

import { syncEditor } from './sync_scroll'
import editor from './editor'
import { lazyChange, lazyResize } from './util'
import { registerToolBarEvents } from './toolbar'

// modals
$(document).on('closed', '.remodal', (e) => {
  editor.focus()
})

$(() => {
  // keep layout percentage after window resizing
  $(window).resize(() => {
    lazyResize()
  })

  // setup toolbar
  registerToolBarEvents()

  // load themes
  let customCssFiles = Cookies.get('custom-css-files')
  if (customCssFiles === undefined) {
    customCssFiles = ''
  }
  customCssFiles.split('\n').forEach((cssfile) => {
    cssfile = cssfile.trim()
    if (cssfile.length > 0) {
      $('head').append('<link rel="stylesheet" href="' + cssfile + '"/>')
    }
  })

  // load plugins
  let customJsFiles = Cookies.get('custom-js-files')
  if (customJsFiles === undefined) {
    customJsFiles = ''
  }
  customJsFiles.split('\n').forEach((jsFile) => {
    jsFile = jsFile.trim()
    if (jsFile.length > 0) {
      $('head').append('<script src="' + jsFile + '"></script>')
    }
  })

  // scroll past end
  $('article#preview').css('padding-bottom', ($('.ui-layout-east').height() - parseInt($('article#preview').css('line-height')) + 1) + 'px')

  // left scroll with right
  $('.ui-layout-east').scroll(() => {
    syncEditor()
  })

  // whenever user changes markdown...
  editor.session.on('change', () => {
    lazyChange()
  })
})
