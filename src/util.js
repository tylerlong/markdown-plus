import Cookies from 'js-cookie'
import { debounce } from 'lodash'
import mdc from 'markdown-core/src/index-browser'

import layout from './layout'
import editor from './editor'

const getPreviewWidth = () => {
  let previewWidth = Cookies.get('editor-versus-preview')
  if (previewWidth === undefined) {
    previewWidth = '50%'
  }
  return previewWidth
}

// neither editor or preview is hidden
const getNormalPreviewWidth = () => {
  let previewWidth = getPreviewWidth()
  if (previewWidth === '1' || previewWidth === '100%') {
    previewWidth = '50%'
  }
  return previewWidth
}

// user changes markdown text
const lazyChange = debounce(() => {
  if (layout.panes.east.outerWidth() < 8) { // preview is hidden
    return // no need to update preview if it's hidden
  }
  mdc.init(editor.session.getValue(), false) // realtime preview
}, 1024, false)

// adjust layout according to percentage configuration
const lazyResize = debounce(() => {
  layout.sizePane('east', getPreviewWidth())
}, 1024, false)

export default { getPreviewWidth, getNormalPreviewWidth, lazyChange, lazyResize }
