import localforage from 'localforage';
import { autoRun } from 'manate';
import { auto } from 'manate/react';
import React, { useEffect } from 'react';
import Split from 'split-grid';

import store, { Store } from '../store';
import Editor from './editor';
import Modals from './modals';
import Preview from './preview';
import Toolbar from './toolbar';

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
            <Preview />
          </div>
        </div>
      </div>
      <Modals store={store} />
    </>
  );
});

export default App;
