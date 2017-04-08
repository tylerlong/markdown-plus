import Cookies from 'js-cookie'
import $ from 'jquery'
import mdc from 'markdown-core/src/index-browser'

import layout from './layout'
import { getPreviewWidth, lazyChange } from './util'
// import editor from './editor'

const loadPreferences = () => {
  let showToolbar = Cookies.get('show-toolbar')
  if (showToolbar === undefined) {
    showToolbar = 'yes'
  }
  $('select#show-toolbar').val(showToolbar)
  if (showToolbar === 'yes') {
    layout.open('north')
  } else {
    layout.close('north')
  }

  const previewWidth = getPreviewWidth()
  $('select#editor-versus-preview').val(previewWidth)
  layout.sizePane('east', previewWidth)

  let keyBinding = Cookies.get('key-binding')
  if (keyBinding === undefined) {
    keyBinding = 'default'
  }
  $('select#key-binding').val(keyBinding)
  // if (keyBinding === 'default') {
  //   editor.setKeyboardHandler(null)
  // } else {
  //   editor.setKeyboardHandler(ace.require('ace/keyboard/' + keyBinding).handler)
  // }

  let fontSize = Cookies.get('editor-font-size')
  if (fontSize === undefined) {
    fontSize = '14'
  }
  $('select#editor-font-size').val(fontSize)
  // editor.setFontSize(fontSize + 'px')

  let editorTheme = Cookies.get('editor-theme')
  if (editorTheme === undefined) {
    editorTheme = 'tomorrow_night_eighties'
  }
  $('select#editor-theme').val(editorTheme)
  // editor.setTheme('ace/theme/' + editorTheme)

  const mdcPreferences = mdc.loadPreferences()
  $('input#gantt-axis-format').val(mdcPreferences['gantt-axis-format'])

  let customCssFiles = Cookies.get('custom-css-files')
  if (customCssFiles === undefined) {
    customCssFiles = ''
  }
  $('textarea#custom-css-files').val(customCssFiles)

  let customJsFiles = Cookies.get('custom-js-files')
  if (customJsFiles === undefined) {
    customJsFiles = ''
  }
  $('textarea#custom-js-files').val(customJsFiles)
}

const preferencesChanged = () => {

}

const mdp = { preferencesChanged, loadPreferences }

$(() => {
  // load preferences
  mdp.loadPreferences()

  // change preferences
  $(document).on('confirmation', '#preferences-modal', () => {
    ['show-toolbar', 'editor-versus-preview', 'key-binding', 'editor-font-size', 'editor-theme'].forEach((key) => {
      Cookies.set(key, $('select#' + key).val(), { expires: 10000 })
    })
    let ganttAxisFormat = $('#gantt-axis-format').val().trim()
    if (ganttAxisFormat === '') {
      ganttAxisFormat = '%Y-%m-%d'
    }
    Cookies.set('gantt-axis-format', ganttAxisFormat, { expires: 10000 })
    const customCssFiles = $('#custom-css-files').val().trim()
    Cookies.set('custom-css-files', customCssFiles, { expires: 10000 })
    const customJsFiles = $('#custom-js-files').val().trim()
    Cookies.set('custom-js-files', customJsFiles, { expires: 10000 })
    loadPreferences()
    lazyChange() // trigger re-render
    mdp.preferencesChanged()
  })
})

window.mdp = mdp
