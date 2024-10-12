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

    // h1 - h6 heading
    $('.heading-icon').click((event) => {
      const level = $(event.currentTarget).data('level');
      const cursor = store.editor.getCursor();
      store.editor.setCursor(cursor.line, 0);
      store.editor.replaceSelection('#'.repeat(level) + ' ');
      store.editor.focus();
    });

    // styling icons
    $('.styling-icon').click((event) => {
      const modifier = $(event.currentTarget).data('modifier');
      if (!store.editor.somethingSelected()) {
        const word = store.editor.findWordAt(store.editor.getCursor());
        store.editor.setSelection(word.anchor, word.head);
      }
      store.editor.replaceSelection(
        modifier + store.editor.getSelection() + modifier,
      );
      store.editor.focus();
    });

    // <hr/>
    $('#horizontal-rule').click(() => {
      const cursor = store.editor.getCursor();
      if (cursor.ch === 0) {
        // cursor is at line start
        store.editor.replaceSelection('\n---\n\n');
      } else {
        store.editor.setCursor({ line: cursor.line }); // navigate to end of line
        store.editor.replaceSelection('\n\n---\n\n');
      }
      store.editor.focus();
    });

    // list icons
    $('.list-icon').click((event) => {
      const prefix = $(event.currentTarget).data('prefix');
      const selection = store.editor.listSelections()[0];
      const minLine = Math.min(selection.head.line, selection.anchor.line);
      const maxLine = Math.max(selection.head.line, selection.anchor.line);
      for (let i = minLine; i <= maxLine; i++) {
        store.editor.setCursor(i, 0);
        store.editor.replaceSelection(prefix);
      }
      store.editor.focus();
    });

    $('#link-icon').click((event) => {
      const text = getSampleText(event);
      const url = $(event.currentTarget).data('sample-url');
      store.editor.replaceSelection(`[${text}](${url})`);
      store.editor.focus();
    });

    $('#image-icon').click((event) => {
      const text = getSampleText(event);
      const url = $(event.currentTarget).data('sample-url');
      store.editor.replaceSelection(`![${text}](${url})`);
      store.editor.focus();
    });

    $('#code-icon').click(() => {
      store.editor.replaceSelection(
        `\n\`\`\`\n${store.editor.getSelection()}\n\`\`\`\n`,
      );
      store.editor.focus();
    });

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
  return (
    <div id="toolbar" className="noselect">
      <i
        title="Bold"
        className="fa fa-bold styling-icon"
        data-modifier="**"
      ></i>
      <i
        title="Italic"
        className="fa fa-italic styling-icon"
        data-modifier="*"
      ></i>
      <i
        title="Strikethrough"
        className="fa fa-strikethrough styling-icon"
        data-modifier="~~"
      ></i>
      <i
        title="Underline"
        className="fa fa-underline styling-icon"
        data-modifier="++"
      ></i>
      <i
        title="Mark"
        className="fa fa-pencil styling-icon"
        data-modifier="=="
      ></i>
      <i className="dividor">|</i>
      <i title="Heading 1" className="fa heading-icon" data-level="1">
        h1
      </i>
      <i title="Heading 2" className="fa heading-icon" data-level="2">
        h2
      </i>
      <i title="Heading 3" className="fa heading-icon" data-level="3">
        h3
      </i>
      <i title="Heading 4" className="fa heading-icon" data-level="4">
        h4
      </i>
      <i title="Heading 5" className="fa heading-icon" data-level="5">
        h5
      </i>
      <i title="Heading 6" className="fa heading-icon" data-level="6">
        h6
      </i>
      <i className="dividor">|</i>
      <i
        title="Horizontal rule"
        id="horizontal-rule"
        className="fa fa-minus"
      ></i>
      <i
        title="Quote"
        className="fa fa-quote-left list-icon"
        data-prefix="> "
      ></i>
      <i
        title="Unordered list"
        className="fa fa-list-ul list-icon"
        data-prefix="- "
      ></i>
      <i
        title="Ordered list"
        className="fa fa-list-ol list-icon"
        data-prefix="1. "
      ></i>
      <i
        title="Incomplete task list"
        className="fa fa-square-o list-icon"
        data-prefix="- [ ] "
      ></i>
      <i
        title="Complete task list"
        className="fa fa-check-square-o list-icon"
        data-prefix="- [x] "
      ></i>
      <i className="dividor">|</i>
      <i
        title="Link"
        className="fa fa-link"
        id="link-icon"
        data-sample="link"
        data-sample-url="https://github.com/tylerlong/markdown-plus"
      ></i>
      <i
        title="Image"
        className="fa fa-image"
        id="image-icon"
        data-sample="image"
        data-sample-url="https://chuntaoliu.com/markdown-plus/icon.svg"
      ></i>
      <i title="Code" className="fa fa-code" id="code-icon"></i>
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
