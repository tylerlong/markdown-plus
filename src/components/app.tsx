import React, { useEffect } from 'react';
import { autoRun, exclude } from 'manate';
import { auto } from 'manate/react';
import localforage from 'localforage';

import markdownUrl from '../sample.md';
import { createEditor } from '../editor';
import { syncPreview } from '../sync_scroll';
import { createLayout } from '../layout';
import { init } from '../init';
import store, { Store } from '../store';
import { loadScript } from '../utils';
import Modals from './modals';
import Toolbar from './toolbar';
import { Splitter } from 'antd';

const main = async () => {
  await loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.0/jquery-ui.min.js',
  );
  await loadScript(
    'https://cdn.jsdelivr.net/jquery.layout/1.4.3/jquery.layout.min.js',
  );

  // create editor
  const editor = createEditor();
  store.editor = exclude(editor);
  editor.on('scroll', () => {
    syncPreview();
  });

  // create layout
  const layout = createLayout();
  store.layout = exclude(layout);

  // new load preferences
  // we don't need to apply preferences to editor or layout, it's done in modals.tsx useEffect
  const savedPreferences = await localforage.getItem<string>('mdp-preferences');
  if (savedPreferences) {
    Object.assign(store.preferences, JSON.parse(savedPreferences));
  }
  // auto save preferences to localforage
  // we can't start it until the first load, otherwise it will save the default preferences
  const preferencesSaver = autoRun(store.preferences, () => {
    console.log('save preferences to localforage');
    localforage.setItem('mdp-preferences', JSON.stringify(store.preferences));
  });
  preferencesSaver.start();

  init();
  const r = await fetch(markdownUrl);
  const data = await r.text();
  editor.setValue(data);
  setTimeout(() => {
    // scroll to hash element
    if (window.location.hash.length > 0) {
      const previewPanel = document.querySelector('#preview').parentElement;
      const linkElement = document.querySelector(
        window.location.hash,
      ) as HTMLElement;
      if (linkElement) {
        const toScroll = linkElement.offsetTop - 24; // 24 is toolbar height
        previewPanel.scrollTop = toScroll;
        // first time scroll `store.editor.heightAtLine(xxx, 'local')` value is wrong
        // trigger again after 300ms
        // it is a codemirror bug, maybe latest version has fixed this issue
        setTimeout(() => {
          previewPanel.scrollTop = toScroll - 1;
          previewPanel.scrollTop = toScroll;
        }, 300);
      }
    }
  }, 3000);
};

const App = auto((props: { store: Store }) => {
  console.log('render app');
  const { store } = props;
  useEffect(() => {
    main();
  }, []);
  return (
    <>
      <Splitter
        layout="vertical"
        onResize={(sizes) => {
          store.preferences.showToolbar = sizes[0] >= 12;
        }}
      >
        <Splitter.Panel
          size={store.preferences.showToolbar ? 24 : 0}
          max={24}
          min={0}
        >
          <Toolbar store={store} />
        </Splitter.Panel>
        <Splitter.Panel>
          <Splitter>
            <Splitter.Panel>
              <textarea id="editor"></textarea>
              <Modals store={store} />
            </Splitter.Panel>
            <Splitter.Panel>
              <article className="markdown-body" id="preview"></article>
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
      </Splitter>

      {/* we keep below as a dummy placeholder because lots of code depends on it */}
      <div id="mdp-container" style={{ height: '1%' }}>
        <div className="ui-layout-north"></div>
        <div className="ui-layout-center"></div>
        <div className="ui-layout-east"></div>
      </div>
    </>
  );
});

export default App;
