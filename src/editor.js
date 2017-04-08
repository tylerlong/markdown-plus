import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/matchesonscrollbar.css'

import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/addon/scroll/scrollpastend.js'
import 'codemirror/keymap/vim.js'
import 'codemirror/keymap/emacs.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/matchesonscrollbar.js'

import { syncPreview } from './sync_scroll'

const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  lineNumbers: true,
  mode: 'markdown',
  theme: 'monokai',
  lineWrapping: true,
  scrollPastEnd: true,
  autofocus: true,
  extraKeys: {'Alt-F': 'findPersistent'}
})

editor.on('scroll', (instance) => {
  syncPreview()
})

export default editor

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
