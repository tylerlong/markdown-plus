import CodeMirror from 'codemirror';

import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/scroll/scrollpastend.js';
import 'codemirror/addon/search/jump-to-line.js';
import 'codemirror/addon/search/match-highlighter.js';
import 'codemirror/addon/search/matchesonscrollbar.css';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/keymap/emacs.js';
import 'codemirror/keymap/sublime.js';
import 'codemirror/keymap/vim.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/clojure/clojure.js';
import 'codemirror/mode/coffeescript/coffeescript.js';
import 'codemirror/mode/commonlisp/commonlisp.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/mode/go/go.js';
import 'codemirror/mode/groovy/groovy.js';
import 'codemirror/mode/haskell/haskell.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/lua/lua.js';
import 'codemirror/mode/perl/perl.js';
import 'codemirror/mode/php/php.js';
import 'codemirror/mode/powershell/powershell.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/r/r.js';
import 'codemirror/mode/ruby/ruby.js';
import 'codemirror/mode/rust/rust.js';
import 'codemirror/mode/shell/shell.js';
import 'codemirror/mode/swift/swift.js';

// dummy implementation of vim commands
const vim = CodeMirror['Vim'];
vim.defineEx('w', 'w', () => {});
vim.defineEx('q', 'q', () => {});
vim.defineEx('wq', 'wq', () => {});

export const createEditor = () => {
  const editor = CodeMirror.fromTextArea(
    document.getElementById('editor') as HTMLTextAreaElement,
    {
      lineNumbers: true,
      mode: 'gfm',
      theme: 'default',
      lineWrapping: true,
      scrollPastEnd: true,
      autofocus: true,
      styleActiveLine: { nonEmpty: true },
      tabSize: 8,
      indentUnit: 4,
    },
  );

  // custom keyboard shortcuts
  const keyMap = CodeMirror['keyMap'];
  const ctrl = keyMap.default === keyMap.macDefault ? 'Cmd' : 'Ctrl';
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
  extraKeys['Tab'] = (cm: CodeMirror.Editor) => {
    cm.execCommand('indentMore');
  };
  editor.setOption('extraKeys', extraKeys);

  // we always want to focus on the editor after replaceSelection
  // todo: maybe latest version of codemirror doesn't need this
  const replaceSelection = editor.replaceSelection.bind(editor);
  editor.replaceSelection = (...args) => {
    replaceSelection(...args);
    editor.focus();
  };

  return editor;
};
