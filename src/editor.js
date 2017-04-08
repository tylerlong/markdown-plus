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

const mac = CodeMirror.keyMap['default'] === CodeMirror.keyMap.macDefault
const ctrl = mac ? 'Cmd' : 'Ctrl'

const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  lineNumbers: true,
  mode: 'markdown',
  theme: 'monokai',
  lineWrapping: true,
  scrollPastEnd: true,
  autofocus: true
})

editor.on('scroll', (instance) => {
  syncPreview()
})

// custom keyboard shortcuts
const extraKeys = { 'Alt-F': 'findPersistent' }
extraKeys[`${ctrl}-B`] = (cm) => {
  document.querySelector('i.fa-bold').click()
}
extraKeys[`${ctrl}-I`] = (cm) => {
  document.querySelector('i.fa-italic').click()
}
extraKeys[`${ctrl}-U`] = (cm) => {
  document.querySelector('i.fa-underline').click()
}
extraKeys[`${ctrl}-,`] = (cm) => {
  document.querySelector('i.fa-cog').click()
}
editor.setOption('extraKeys', extraKeys)

export default editor

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
