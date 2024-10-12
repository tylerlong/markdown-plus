import { auto } from 'manate/react';
import debounce from 'lodash/debounce';
import mdc from 'markdown-core/src/index-browser';
import { exclude } from 'manate';
import React, { useEffect } from 'react';

import { Store } from '../store';
import { createEditor } from '../editor';
import { syncPreview } from '../sync_scroll';
import markdownUrl from '../sample.md';

const Editor = auto((props: { store: Store }) => {
  const { store } = props;
  useEffect(() => {
    // init editor
    const editor = createEditor();
    store.editor = exclude(editor);
    editor.on('scroll', () => {
      syncPreview();
    });

    // whenever user changes markdown
    const lazyChange = debounce(
      () => {
        mdc.init(store.editor.getValue()); // realtime preview
      },
      1024,
      { leading: false, trailing: true },
    );
    editor.on('changes', () => {
      lazyChange();
    });

    // load sample markdown
    const loadSample = async () => {
      const r = await fetch(markdownUrl);
      const data = await r.text();
      editor.setValue(data);
    };
    loadSample();
  }, []);
  return <textarea id="editor"></textarea>;
});

export default Editor;
