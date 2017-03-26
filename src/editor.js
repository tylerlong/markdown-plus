import ace from 'brace'
import $ from 'jquery'

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

// extension methods for editor
editor.selection.smartRange = () => {
  let range = editor.selection.getRange()
  if (!range.isEmpty()) {
    return range // return what user selected
  }
  // nothing was selected
  const _range = range // backup original range
  range = editor.selection.getWordRange(range.start.row, range.start.column) // range for current word
  if (editor.session.getTextRange(range).trim().length === 0) { // selected is blank
    range = _range // restore original range
  }
  return range
}

// overwrite some ACE editor keyboard shortcuts
editor.commands.addCommands([
  {
    name: 'preferences',
    bindKey: { win: 'Ctrl-,', mac: 'Command-,' },
    exec: (editor) => {
      $('i.fa-cog').click() // show preferences modal
    }
  },
  {
    name: 'bold',
    bindKey: { win: 'Ctrl-B', mac: 'Command-B' },
    exec: (editor) => {
      $('i.fa-bold').click()
    }
  },
  {
    name: 'italic',
    bindKey: { win: 'Ctrl-I', mac: 'Command-I' },
    exec: (editor) => {
      $('i.fa-italic').click()
    }
  },
  {
    name: 'underline',
    bindKey: { win: 'Ctrl-U', mac: 'Command-U' },
    exec: (editor) => {
      $('i.fa-underline').click()
    }
  }
])

export default editor
