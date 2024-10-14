import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import {
  defaultHighlightStyle,
  syntaxHighlighting,
} from '@codemirror/language';
import {
  EditorView,
  keymap,
  lineNumbers,
  scrollPastEnd,
  ViewUpdate,
} from '@codemirror/view';
import debounce from 'debounce';
import { exclude } from 'manate';
import { auto } from 'manate/react';
import mdc from 'markdown-core/src/index-browser';
import React, { useEffect, useRef } from 'react';

import markdownUrl from '../sample.md';
import { Store } from '../store';

const Editor = auto((props: { store: Store }) => {
  const { store } = props;
  const editorDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const contentChangeListener = EditorView.updateListener.of(
      (update: ViewUpdate) => {
        if (update.docChanged) {
          lazyChange();
        }
      },
    );
    const cm = new EditorView({
      extensions: [
        lineNumbers(),
        scrollPastEnd(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        markdown(),
        syntaxHighlighting(defaultHighlightStyle),
        contentChangeListener,
      ],
      parent: editorDiv.current!,
    });
    store.editor = exclude(cm);

    // whenever user changes markdown
    const lazyChange = debounce(() => {
      mdc.init(store.editor.state.doc.toString()); // realtime preview
    }, 512);

    // load sample markdown
    const loadSample = async () => {
      const r = await fetch(markdownUrl);
      const data = await r.text();
      store.editor.dispatch({
        changes: {
          from: 0,
          to: store.editor.state.doc.length,
          insert: data,
        },
      });
    };
    loadSample();
  }, []);
  return <div id="editor" ref={editorDiv}></div>;
});

export default Editor;
