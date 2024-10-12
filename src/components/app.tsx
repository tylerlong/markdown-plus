import React, { useEffect } from 'react';
import { autoRun } from 'manate';
import { auto } from 'manate/react';
import localforage from 'localforage';
import Split from 'split-grid';
import $ from 'jquery';

import store, { Store } from '../store';
import Modals from './modals';
import Toolbar from './toolbar';
import Editor from './editor';
import { syncEditor } from '../sync_scroll';

const main = async () => {
  // load preferences
  // we don't need to apply preferences here, it's done in modals.tsx useEffect
  const savedPreferences = await localforage.getItem<string>('mdp-preferences');
  if (savedPreferences) {
    Object.assign(store.preferences, JSON.parse(savedPreferences));
  }
  // auto save preferences to localforage
  // we can't start it until the first load, otherwise it will save the default preferences
  const preferencesSaver = autoRun(store.preferences, () => {
    localforage.setItem('mdp-preferences', JSON.stringify(store.preferences));
  });
  preferencesSaver.start();

  // apply themes
  store.preferences.customCssFiles.split('\n').forEach((cssfile) => {
    cssfile = cssfile.trim();
    if (cssfile.length > 0) {
      $('head').append('<link rel="stylesheet" href="' + cssfile + '"/>');
    }
  });

  // apply plugins
  store.preferences.customJsFiles.split('\n').forEach((jsFile) => {
    jsFile = jsFile.trim();
    if (jsFile.length > 0) {
      $('head').append('<script src="' + jsFile + '"></script>');
    }
  });

  // scroll past end
  $('article#preview').css(
    'padding-bottom',
    $('#left-panel').height() -
      parseInt($('article#preview').css('line-height'), 10) +
      'px',
  );

  // left scroll with right
  $('#right-panel').scroll(() => {
    syncEditor();
  });

  setTimeout(() => {
    // scroll to hash element
    if (window.location.hash.length > 0) {
      const previewPanel = document.querySelector('#preview').parentElement;
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

const App = auto((props: { store: Store }) => {
  console.log('render app');
  const { store } = props;
  const { preferences } = store;
  useEffect(() => {
    main();
  }, []);

  useEffect(() => {
    Split({
      columnGutters: [
        {
          track: 1,
          element: document.querySelector('#col-gutter')!,
        },
      ],
      snapOffset: 64,
    });
  }, []);
  return (
    <>
      <div
        id="rows-grid"
        style={{
          gridTemplateRows: preferences.showToolbar
            ? '20px 6px 1fr'
            : '0fr 6px 1fr',
        }}
      >
        <div id="toolbar">
          <Toolbar store={store} />
        </div>
        <div
          id="row-gutter"
          className="gutter"
          title={preferences.showToolbar ? 'Hide toolbar' : 'Show toolbar'}
          onClick={() => (preferences.showToolbar = !preferences.showToolbar)}
        ></div>
        <div
          id="cols-grid"
          style={{ gridTemplateColumns: preferences.editorVsPreview }}
        >
          <div id="left-panel">
            <Editor store={store} />
          </div>
          <div id="col-gutter" className="gutter" title="Resize"></div>
          <div id="right-panel">
            {' '}
            <article className="markdown-body" id="preview"></article>
          </div>
        </div>
      </div>
      <Modals store={store} />
    </>
  );
});

export default App;
