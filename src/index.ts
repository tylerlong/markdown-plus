import $ from 'jquery';

import markdownUrl from './sample.md';
import { createEditor } from './editor';
import { syncPreview } from './sync_scroll';
import { createLayout } from './layout';
import { init } from './init';
import { initPreferences } from './preferences';
import store from './store';
import { loadScript } from './utils';

global.$ = global.jQuery = $;

// load sample text and get anchor links correct
$(async () => {
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
    // a little gap to top
    window.addEventListener('hashchange', () => {
      $('.ui-layout-east').scrollTop($('.ui-layout-east').scrollTop() - 6);
    });

    // scroll to hash element
    if (window.location.hash.length > 0) {
      $('.ui-layout-east').scrollTop($(window.location.hash).offset().top - 30);
    }
  }, 3000);
});
