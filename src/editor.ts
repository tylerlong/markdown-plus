import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/matchesonscrollbar.css';

import CodeMirror from 'codemirror';

import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/php/php.js';
import 'codemirror/mode/ruby/ruby.js';
import 'codemirror/mode/shell/shell.js';
import 'codemirror/mode/r/r.js';
import 'codemirror/mode/go/go.js';
import 'codemirror/mode/perl/perl.js';
import 'codemirror/mode/coffeescript/coffeescript.js';
import 'codemirror/mode/swift/swift.js';
import 'codemirror/mode/commonlisp/commonlisp.js';
import 'codemirror/mode/haskell/haskell.js';
import 'codemirror/mode/lua/lua.js';
import 'codemirror/mode/clojure/clojure.js';
import 'codemirror/mode/groovy/groovy.js';
import 'codemirror/mode/rust/rust.js';
import 'codemirror/mode/powershell/powershell.js';

import 'codemirror/addon/scroll/scrollpastend.js';
import 'codemirror/keymap/vim.js';
import 'codemirror/keymap/emacs.js';
import 'codemirror/keymap/sublime.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/jump-to-line.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/search/match-highlighter.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/selection/active-line.js';

import { syncPreview } from './sync_scroll';

// load all the themes
export const themes = [
  '3024-day',
  '3024-night',
  'abcdef',
  'ambiance-mobile',
  'ambiance',
  'base16-dark',
  'base16-light',
  'bespin',
  'blackboard',
  'cobalt',
  'colorforth',
  'dracula',
  'duotone-dark',
  'duotone-light',
  'eclipse',
  'elegant',
  'erlang-dark',
  'hopscotch',
  'icecoder',
  'isotope',
  'lesser-dark',
  'liquibyte',
  'material',
  'mbo',
  'mdn-like',
  'midnight',
  'monokai',
  'neat',
  'neo',
  'night',
  'panda-syntax',
  'paraiso-dark',
  'paraiso-light',
  'pastel-on-dark',
  'railscasts',
  'rubyblue',
  'seti',
  'solarized',
  'the-matrix',
  'tomorrow-night-bright',
  'tomorrow-night-eighties',
  'ttcn',
  'twilight',
  'vibrant-ink',
  'xq-dark',
  'xq-light',
  'yeti',
  'zenburn',
];

const mac = CodeMirror.keyMap['default'] === CodeMirror.keyMap.macDefault;
const ctrl = mac ? 'Cmd' : 'Ctrl';

const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  lineNumbers: true,
  mode: 'gfm',
  theme: 'default',
  lineWrapping: true,
  scrollPastEnd: true,
  autofocus: true,
  styleActiveLine: { nonEmpty: true },
  tabSize: 8,
  indentUnit: 4,
});

editor.on('scroll', () => {
  syncPreview();
});

// custom keyboard shortcuts
const extraKeys = { 'Alt-F': 'findPersistent' };
const items = [
  [`${ctrl}-B`, 'i.fa-bold'],
  [`${ctrl}-I`, 'i.fa-italic'],
  [`${ctrl}-U`, 'i.fa-underline'],
  [`${ctrl}-,`, 'i.fa-cog'],
];
items.forEach((item) => {
  extraKeys[item[0]] = () => {
    (document.querySelector(item[1]) as HTMLElement).click();
  };
});
extraKeys['Tab'] = (cm) => {
  cm.execCommand('indentMore');
};
editor.setOption('extraKeys', extraKeys);

// default implementation of vim commands
CodeMirror.Vim.defineEx('w', 'w', () => {
  console.log('write');
});
CodeMirror.Vim.defineEx('q', 'q', (cm, input) => {
  if (input.input === 'q') {
    console.log('quit');
  } else if (input.input === 'q!') {
    console.log('force quit');
  }
});
CodeMirror.Vim.defineEx('wq', 'wq', () => {
  console.log('write then quit');
});

// custom commands
CodeMirror.commands.toUpperCase = (cm) => {
  cm.replaceSelection(cm.getSelection().toUpperCase());
};
CodeMirror.commands.toLowerCase = (cm) => {
  cm.replaceSelection(cm.getSelection().toLowerCase());
};

export default editor;
