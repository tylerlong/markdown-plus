import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/matchesonscrollbar.css'

import CodeMirror from 'codemirror'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/addon/scroll/scrollpastend.js'
import 'codemirror/keymap/vim.js'
import 'codemirror/keymap/emacs.js'
import 'codemirror/keymap/sublime.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/matchesonscrollbar.js'

import { syncPreview } from './sync_scroll'

// load all the themes
['3024-day', '3024-night', 'abcdef', 'ambiance-mobile', 'ambiance', 'base16-dark', 'base16-light', 'bespin', 'blackboard', 'cobalt', 'colorforth', 'dracula', 'duotone-dark', 'duotone-light', 'eclipse', 'elegant', 'erlang-dark', 'hopscotch', 'icecoder', 'isotope', 'lesser-dark', 'liquibyte', 'material', 'mbo', 'mdn-like', 'midnight', 'monokai', 'neat', 'neo', 'night', 'panda-syntax', 'paraiso-dark', 'paraiso-light', 'pastel-on-dark', 'railscasts', 'rubyblue', 'seti', 'solarized', 'the-matrix', 'tomorrow-night-bright', 'tomorrow-night-eighties', 'ttcn', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light', 'yeti', 'zenburn'].forEach((theme) => {
  require(`codemirror/theme/${theme}.css`)
})

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

// default implementation of vim commands
CodeMirror.Vim.defineEx('w', 'w', (cm, input) => {
  console.log('write')
})
CodeMirror.Vim.defineEx('q', 'q', (cm, input) => {
  if (input.input === 'q') {
    console.log('quit')
  } else if (input.input === 'q!') {
    console.log('force quit')
  }
})
CodeMirror.Vim.defineEx('wq', 'wq', (cm, input) => {
  console.log('write then quit')
})

export default editor
