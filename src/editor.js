import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'

import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/addon/scroll/scrollpastend.js'

const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  lineNumbers: true,
  mode: 'markdown',
  theme: 'monokai',
  lineWrapping: true,
  scrollPastEnd: true
})

export default editor

// import $ from 'jquery'

// import { syncPreview } from './sync_scroll'

// const ace = window.ace

// const editor = ace.edit('editor')
// editor.session.setUseWorker(false)
// editor.$blockScrolling = Infinity
// editor.renderer.setShowPrintMargin(false)
// editor.session.setMode('ace/mode/markdown')
// editor.session.setUseWrapMode(true)
// editor.setScrollSpeed(1)
// editor.setOption('scrollPastEnd', true)
// editor.session.setFoldStyle('manual')
// editor.focus()
// editor.session.on('changeScrollTop', (scroll) => {
//   syncPreview() // right scroll with left
// })

// // extension methods for editor
// editor.selection.smartRange = () => {
//   let range = editor.selection.getRange()
//   if (!range.isEmpty()) {
//     return range // return what user selected
//   }
//   // nothing was selected
//   const _range = range // backup original range
//   range = editor.selection.getWordRange(range.start.row, range.start.column) // range for current word
//   if (editor.session.getTextRange(range).trim().length === 0) { // selected is blank
//     range = _range // restore original range
//   }
//   return range
// }

// // overwrite some ACE editor keyboard shortcuts
// editor.commands.addCommands([
//   {
//     name: 'preferences',
//     bindKey: { win: 'Ctrl-,', mac: 'Command-,' },
//     exec: (editor) => {
//       $('i.fa-cog').click() // show preferences modal
//     }
//   },
//   {
//     name: 'bold',
//     bindKey: { win: 'Ctrl-B', mac: 'Command-B' },
//     exec: (editor) => {
//       $('i.fa-bold').click()
//     }
//   },
//   {
//     name: 'italic',
//     bindKey: { win: 'Ctrl-I', mac: 'Command-I' },
//     exec: (editor) => {
//       $('i.fa-italic').click()
//     }
//   },
//   {
//     name: 'underline',
//     bindKey: { win: 'Ctrl-U', mac: 'Command-U' },
//     exec: (editor) => {
//       $('i.fa-underline').click()
//     }
//   }
// ])

// // default implementation of vim commands
// const Vim = ace.require('ace/keyboard/vim').CodeMirror.Vim
// Vim.defineEx('write', 'w', (cm, input) => {
//   console.log('write')
// })
// Vim.defineEx('quit', 'q', (cm, input) => {
//   if (input.input === 'q') {
//     console.log('quit')
//   } else if (input.input === 'q!') {
//     console.log('quit without warning')
//   }
// })
// Vim.defineEx('wq', 'wq', (cm, input) => {
//   console.log('write then quit')
// })

// export default editor
