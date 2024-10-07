import Cookies from 'js-cookie';
import $ from 'jquery';
import mdc from 'markdown-core/src/index-browser';

import layout from './layout';
import { getPreviewWidth, lazyChange } from './util';
import editor, { themes } from './editor';

const loadShowToolbar = () => {
  const showToolbar = Cookies.get('show-toolbar') || 'yes';
  $('select#show-toolbar').val(showToolbar);
  if (showToolbar === 'yes') {
    layout.open('north');
  } else {
    layout.close('north');
  }
};

const loadKeyBinding = () => {
  const keyBinding = Cookies.get('key-binding') || 'default';
  $('select#key-binding').val(keyBinding);
  editor.setOption('keyMap', keyBinding);
};

const loadEditorFontSize = () => {
  const fontSize = Cookies.get('editor-font-size') || '14';
  $('select#editor-font-size').val(fontSize);
  document.querySelector('.CodeMirror').style.fontSize = `${fontSize}px`;
};

const loadEditorTheme = () => {
  let editorTheme = Cookies.get('editor-theme');
  if (!themes.includes(editorTheme)) {
    editorTheme = 'default';
  }
  $('select#editor-theme').val(editorTheme);
  editor.setOption('theme', editorTheme);
};

const loadCustomFiles = () => {
  const customCssFiles = Cookies.get('custom-css-files') || '';
  $('textarea#custom-css-files').val(customCssFiles);

  const customJsFiles = Cookies.get('custom-js-files') || '';
  $('textarea#custom-js-files').val(customJsFiles);
};

const loadPreferences = () => {
  loadShowToolbar();

  const previewWidth = getPreviewWidth();
  $('select#editor-versus-preview').val(previewWidth);
  layout.sizePane('east', previewWidth);

  loadKeyBinding();

  loadEditorFontSize();

  loadEditorTheme();

  const mdcPreferences = mdc.loadPreferences();
  $('input#gantt-axis-format').val(mdcPreferences['gantt-axis-format']);

  loadCustomFiles();
};

const preferencesChanged = () => {};

const mdp = { preferencesChanged, loadPreferences };

$(() => {
  // load preferences
  mdp.loadPreferences();

  // change preferences
  $(document).on('confirmation', '#preferences-modal', () => {
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
    mdp.preferencesChanged();
  });
});

window.mdp = mdp;
