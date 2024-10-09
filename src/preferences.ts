import Cookies from 'js-cookie';
import $ from 'jquery';
import mdc from 'markdown-core/src/index-browser';

import { lazyChange } from './utils';
import store from './store';

const loadKeyBinding = () => {
  const keyBinding = Cookies.get('key-binding') || 'default';
  $('select#key-binding').val(keyBinding);
  store.editor.setOption('keyMap', keyBinding);
};

const loadEditorFontSize = () => {
  const fontSize = Cookies.get('editor-font-size') || '14';
  $('select#editor-font-size').val(fontSize);
  (document.querySelector('.CodeMirror') as HTMLDivElement).style.fontSize =
    `${fontSize}px`;
};

const loadCustomFiles = () => {
  const customCssFiles = Cookies.get('custom-css-files') || '';
  $('textarea#custom-css-files').val(customCssFiles);

  const customJsFiles = Cookies.get('custom-js-files') || '';
  $('textarea#custom-js-files').val(customJsFiles);
};

export const loadPreferences = () => {
  loadKeyBinding();

  loadEditorFontSize();

  const mdcPreferences = mdc.loadPreferences();
  $('input#gantt-axis-format').val(mdcPreferences['gantt-axis-format']);

  loadCustomFiles();
};

export const savePreferences = () => {
  [
    'show-toolbar',
    'editor-versus-preview',
    'key-binding',
    'editor-font-size',
    'editor-theme',
  ].forEach((key) => {
    Cookies.set(key, $('select#' + key).val(), { expires: 10000 });
  });
  let ganttAxisFormat = $('#gantt-axis-format').val().trim();
  if (ganttAxisFormat === '') {
    ganttAxisFormat = '%Y-%m-%d';
  }
  Cookies.set('gantt-axis-format', ganttAxisFormat, { expires: 10000 });
  const customCssFiles = $('#custom-css-files').val().trim();
  Cookies.set('custom-css-files', customCssFiles, { expires: 10000 });
  const customJsFiles = $('#custom-js-files').val().trim();
  Cookies.set('custom-js-files', customJsFiles, { expires: 10000 });
  loadPreferences();
  lazyChange(); // trigger re-render
};
