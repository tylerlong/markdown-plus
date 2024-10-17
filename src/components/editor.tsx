import {
  defaultKeymap,
  history,
  historyKeymap,
  indentMore,
} from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import {
  defaultHighlightStyle,
  syntaxHighlighting,
} from '@codemirror/language';
import {
  EditorView,
  highlightActiveLine,
  keymap,
  lineNumbers,
  scrollPastEnd,
  ViewUpdate,
} from '@codemirror/view';
import { githubLight } from '@uiw/codemirror-theme-github';
import debounce from 'debounce';
import { exclude } from 'manate';
import { auto } from 'manate/react';
import mdc from 'markdown-core/src/index-browser';
import React, { useEffect, useRef } from 'react';

import markdownUrl from '../sample.md';
import { Store } from '../store';
import { syncEditor, syncPreview } from '../sync_scroll';

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

    // Define the custom key binding
    const customKeymap = keymap.of([
      {
        key: 'Tab',
        run: indentMore,
      },
    ]);
    const cm = new EditorView({
      extensions: [
        store.editorTheme.of(githubLight),
        store.editorFontSize.of(
          EditorView.theme({
            '&': {
              fontSize: store.preferences.editorFontSize + 'px',
            },
          }),
        ),
        EditorView.lineWrapping,
        highlightActiveLine(),
        lineNumbers(),
        scrollPastEnd(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        markdown(),
        syntaxHighlighting(defaultHighlightStyle),
        customKeymap,
        contentChangeListener,
      ],
      parent: editorDiv.current!,
    });

    // auto focus after change text
    const dispatch = cm.dispatch.bind(cm);
    cm.dispatch = (tr) => {
      dispatch(tr);
      if (tr.changes && tr.changes.insert) {
        cm.focus();
      }
    };

    store.editor = exclude(cm);

    store.editor.scrollDOM.addEventListener('scroll', () => {
      syncPreview();
    });
    document.getElementById('right-panel').addEventListener('scroll', () => {
      syncEditor();
    });

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
