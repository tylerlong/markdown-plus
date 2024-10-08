import $ from 'jquery';
global.$ = global.jQuery = $;

import markdownUrl from './sample.md';
import { createEditor } from './editor';
import { syncPreview } from './sync_scroll';
import { createLayout } from './layout';
import { init } from './init';
import { initPreferences } from './preferences';
import store from './store';
import { loadScript } from './utils';

// load sample text and get anchor links correct
const main = async () => {
  document.removeEventListener('DOMContentLoaded', main);
  await loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/remodal/1.1.1/remodal.min.js',
  );
  await loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.0/jquery-ui.min.js',
  );
  await loadScript(
    'https://cdn.jsdelivr.net/jquery.layout/1.4.3/jquery.layout.min.js',
  );

  // create editor
  const editor = createEditor();
  store.editor = editor;
  editor.on('scroll', () => {
    syncPreview();
  });

  // create layout
  const layout = createLayout();
  store.layout = layout;

  init();
  initPreferences();
  const r = await fetch(markdownUrl);
  const data = await r.text();
  editor.setValue(data);
  setTimeout(() => {
    // scroll to hash element
    if (window.location.hash.length > 0) {
      const previewPanel = document.querySelector('.ui-layout-east');
      const linkElement = document.querySelector(
        window.location.hash,
      ) as HTMLElement;
      if (linkElement) {
        previewPanel.scrollTop = linkElement.offsetTop;
        // first time scroll `store.editor.heightAtLine(xxx, 'local')` value is wrong
        // trigger again after 300ms
        // it is a codemirror bug, maybe latest version has fixed this issue
        setTimeout(() => {
          previewPanel.scrollTop = linkElement.offsetTop - 1;
          previewPanel.scrollTop = linkElement.offsetTop;
        }, 300);
      }
    }
  }, 3000);
};
document.addEventListener('DOMContentLoaded', main);
