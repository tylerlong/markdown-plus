import ace from 'brace'

import { syncPreview } from './sync_scroll'

const editor = ace.edit('editor')
editor.session.setUseWorker(false)
editor.$blockScrolling = Infinity
editor.renderer.setShowPrintMargin(false)
editor.session.setMode('ace/mode/markdown')
editor.session.setUseWrapMode(true)
editor.setScrollSpeed(1)
editor.setOption('scrollPastEnd', true)
editor.session.setFoldStyle('manual')
editor.focus()
editor.session.on('changeScrollTop', (scroll) => {
  syncPreview() // right scroll with left
})

export default editor
