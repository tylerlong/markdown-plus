import debounce from 'lodash/debounce';
import { exclude } from 'manate';
import { auto } from 'manate/react';
import mdc from 'markdown-core/src/index-browser';
import React, { useEffect } from 'react';

import { createEditor } from '../codemirror';
import markdownUrl from '../sample.md';
import { Store } from '../store';
import { syncEditor, syncPreview } from '../sync_scroll';

const Editor = auto((props: { store: Store }) => {
  const { store } = props;
  useEffect(() => {
    // init editor
    const editor = createEditor(
      document.getElementById('editor') as HTMLTextAreaElement,
    );
    store.editor = exclude(editor);
    editor.on('scroll', () => {
      syncPreview();
    });
    document.getElementById('right-panel').addEventListener('scroll', () => {
      syncEditor();
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
