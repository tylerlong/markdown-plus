import { auto } from 'manate/react';
import React, { useEffect } from 'react';
import $ from 'jquery';

import { Store } from '../store';

const Toolbar = auto((props: { store: Store }) => {
  console.log('render toolbar');
  const { store } = props;
  const { modals } = store;
  useEffect(() => {
    const getSampleText = (event) => {
      let text = store.editor.getSelection();
      if (text.trim() === '') {
        text = $(event.currentTarget).data('sample');
      }
      return text;
    };

    $('#table-icon').click((event) => {
      const sample = $(event.currentTarget).data('sample');
      const cursor = store.editor.getCursor();
      if (cursor.ch === 0) {
        // cursor is at line start
        store.editor.replaceSelection(`\n${sample}\n\n`);
      } else {
        store.editor.setCursor({ line: cursor.line }); // navigate to line end
        store.editor.replaceSelection(`\n\n${sample}\n`);
      }
      store.editor.focus();
    });

    $('#math-icon').click((event) => {
      const text = getSampleText(event);
      store.editor.replaceSelection(`\n\`\`\`katex\n${text}\n\`\`\`\n`);
      store.editor.focus();
    });

    $('.mermaid-icon').click((event) => {
      const text = getSampleText(event);
      store.editor.replaceSelection(`\n\`\`\`mermaid\n${text}\n\`\`\`\n`);
      store.editor.focus();
    });
  }, []);
  const stylingClicked = (modifier: string) => {
    if (!store.editor.somethingSelected()) {
      const word = store.editor.findWordAt(store.editor.getCursor());
      store.editor.setSelection(word.anchor, word.head);
    }
    store.editor.replaceSelection(
      modifier + store.editor.getSelection() + modifier,
    );
    store.editor.focus();
  };
  const headingClicked = (level: number) => {
    const cursor = store.editor.getCursor();
    store.editor.setCursor(cursor.line, 0);
    store.editor.replaceSelection('#'.repeat(level) + ' ');
    store.editor.focus();
  };
  const hrClicked = () => {
    const cursor = store.editor.getCursor();
    if (cursor.ch === 0) {
      // cursor is at line start
      store.editor.replaceSelection('\n---\n\n');
    } else {
      store.editor.setCursor({ line: cursor.line }); // navigate to end of line
      store.editor.replaceSelection('\n\n---\n\n');
    }
    store.editor.focus();
  };
  const listClicked = (prefix: string) => {
    const selection = store.editor.listSelections()[0];
    const minLine = Math.min(selection.head.line, selection.anchor.line);
    const maxLine = Math.max(selection.head.line, selection.anchor.line);
    for (let i = minLine; i <= maxLine; i++) {
      store.editor.setCursor(i, 0);
      store.editor.replaceSelection(prefix);
    }
    store.editor.focus();
  };
  return (
    <div id="toolbar" className="noselect">
      {[
        { title: 'Bold', icon: 'fa-bold', modifier: '**' },
        { title: 'Italic', icon: 'fa-italic', modifier: '*' },
        { title: 'Strikethrough', icon: 'fa-strikethrough', modifier: '~~' },
        { title: 'Underline', icon: 'fa-underline', modifier: '++' },
        { title: 'Mark', icon: 'fa-pencil', modifier: '==' },
      ].map(({ title, icon, modifier }) => (
        <i
          key={title}
          title={title}
          className={`fa ${icon}`}
          onClick={() => stylingClicked(modifier)}
        ></i>
      ))}
      <i className="dividor">|</i>
      {[1, 2, 3, 4, 5, 6].map((level) => (
        <i
          key={level}
          title={`Heading ${level}`}
          className="fa heading-icon"
          onClick={() => headingClicked(level)}
        >
          h{level}
        </i>
      ))}
      <i className="dividor">|</i>
      <i
        title="Horizontal rule"
        className="fa fa-minus"
        onClick={() => hrClicked()}
      ></i>
      {[
        { name: 'Quote', icon: 'fa-quote-left', prefix: '> ' },
        { name: 'Unordered list', icon: 'fa-list-ul', prefix: '- ' },
        { name: 'Ordered list', icon: 'fa-list-ol', prefix: '1. ' },
        { name: 'Incomplete task list', icon: 'fa-square-o', prefix: '- [ ] ' },
        {
          name: 'Complete task list',
          icon: 'fa-check-square-o',
          prefix: '- [x] ',
        },
      ].map(({ name, icon, prefix }) => (
        <i
          key={name}
          title={name}
          className={`fa ${icon}`}
          onClick={() => listClicked(prefix)}
        ></i>
      ))}
      <i className="dividor">|</i>
      <i
        title="Link"
        className="fa fa-link"
        onClick={() => {
          const text = store.editor.getSelection().trim() || 'link';
          store.editor.replaceSelection(
            `[${text}](https://github.com/tylerlong/markdown-plus)`,
          );
          store.editor.focus();
        }}
      ></i>
      <i
        title="Image"
        className="fa fa-image"
        onClick={() => {
          const text = store.editor.getSelection().trim() || 'image';
          store.editor.replaceSelection(
            `![${text}](https://chuntaoliu.com/markdown-plus/icon.svg)`,
          );
          store.editor.focus();
        }}
      ></i>
      <i
        title="Code"
        className="fa fa-code"
        onClick={() => {
          store.editor.replaceSelection(
            `\n\`\`\`\n${store.editor.getSelection()}\n\`\`\`\n`,
          );
          store.editor.focus();
        }}
      ></i>
      <i
        title="Table"
        className="fa fa-table"
        id="table-icon"
        data-sample="header 1 | header 2
---|---
row 1 col 1 | row 1 col 2
row 2 col 1 | row 2 col 2"
      ></i>
      <i className="dividor">|</i>
      <i
        title="Emoji"
        className="fa fa-smile-o"
        onClick={() => modals.emoji.open()}
      ></i>
      <i
        title="Font awesome"
        className="fa fa-flag-o"
        onClick={() => modals.fontAwesome.open()}
      ></i>
      <i className="dividor">|</i>
      <i
        title="Mathematical formula"
        className="fa fa-superscript"
        id="math-icon"
        data-sample="E = mc^2"
      ></i>
      <i
        title="Flowchart"
        className="fa fa-long-arrow-right mermaid-icon"
        data-sample="graph LR
A-->B"
      ></i>
      <i
        title="Sequence diagram"
        className="fa fa-exchange mermaid-icon"
        data-sample="sequenceDiagram
A->>B: How are you?
B->>A: Great!"
      ></i>
      <i
        title="Gantt diagram"
        className="fa fa-sliders mermaid-icon"
        data-sample="gantt
dateFormat YYYY-MM-DD
section S1
T1: 2014-01-01, 9d
section S2
T2: 2014-01-11, 9d
section S3
T3: 2014-01-02, 9d"
      ></i>
      <i className="dividor">|</i>
      <i
        title="Preferences"
        className="fa fa-cog"
        onClick={() => modals.preferences.open()}
      ></i>
      <i
        title="Help"
        className="fa fa-question-circle"
        onClick={() => modals.help.open()}
      ></i>
      <i
        title="About"
        className="fa fa-info-circle"
        onClick={() => modals.about.open()}
      ></i>
    </div>
  );
});

export default Toolbar;
