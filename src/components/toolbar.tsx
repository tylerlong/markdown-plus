import { auto } from 'manate/react';
import React from 'react';

import iconUrl from '../icon.svg';
import { Store } from '../store';

const Toolbar = auto((props: { store: Store }) => {
  console.log('render toolbar');
  const { store } = props;
  const { modals } = store;
  const stylingClicked = (modifier: string) => {
    const editor = store.editor;
    let mainSelection = editor.state.selection.main;
    if (mainSelection.empty) {
      const word = editor.state.wordAt(mainSelection.head);
      if (word) {
        editor.dispatch({
          selection: { anchor: word.from, head: word.to },
        });
      }
    }
    mainSelection = editor.state.selection.main; // don't forget to update this variable
    editor.dispatch({
      changes: {
        from: mainSelection.from,
        to: mainSelection.to,
        insert: `${modifier}${editor.state.sliceDoc(
          mainSelection.from,
          mainSelection.to,
        )}${modifier}`,
      },
    });
    editor.focus();
  };
  const headingClicked = (level: number) => {
    const editor = store.editor;
    const currentLine = editor.state.doc.lineAt(
      editor.state.selection.main.head,
    );
    editor.dispatch({
      changes: {
        from: currentLine.from,
        to: currentLine.from,
        insert: `${'#'.repeat(level)} `,
      },
    });
    editor.focus();
  };
  const hrClicked = () => {
    const editor = store.editor;
    const cursorPos = editor.state.selection.main.head;
    const currentLine = editor.state.doc.lineAt(cursorPos);
    const isAtLineStart = cursorPos === currentLine.from;
    if (isAtLineStart) {
      editor.dispatch({
        changes: {
          from: currentLine.from,
          to: currentLine.from,
          insert: '\n---\n\n',
        },
      });
    } else {
      editor.dispatch({
        changes: {
          from: currentLine.to,
          to: currentLine.to,
          insert: '\n\n---\n\n',
        },
      });
    }
    editor.focus();
  };
  const listClicked = (prefix: string) => {
    const editor = store.editor;
    const startLine = editor.state.doc.lineAt(editor.state.selection.main.from);
    const endLine = editor.state.doc.lineAt(editor.state.selection.main.to);
    for (let i = startLine.number; i <= endLine.number; i++) {
      const line = editor.state.doc.line(i);
      editor.dispatch({
        changes: {
          from: line.from,
          to: line.from,
          insert: prefix,
        },
      });
      editor.focus();
    }
  };
  const mermaidClicked = (sample: string) => {
    const editor = store.editor;
    const mainSelection = editor.state.selection.main;
    const text =
      editor.state.sliceDoc(mainSelection.from, mainSelection.to) || sample;
    editor.dispatch({
      changes: {
        from: mainSelection.from,
        to: mainSelection.to,
        insert: `\n\`\`\`mermaid\n${text}\n\`\`\`\n`,
      },
    });
    editor.focus();
  };
  return (
    <div id="toolbar" className="noselect">
      <img
        src={iconUrl}
        id="about-icon"
        onClick={() => modals.about.open()}
        title="About"
      />
      <i className="dividor">|</i>
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
          const editor = store.editor;
          const mainSelection = editor.state.selection.main;
          const text =
            editor.state.sliceDoc(mainSelection.from, mainSelection.to) ||
            'link';
          editor.dispatch({
            changes: {
              from: mainSelection.from,
              to: mainSelection.to,
              insert: `[${text}](https://github.com/tylerlong/markdown-plus/)`,
            },
          });
          editor.focus();
        }}
      ></i>
      <i
        title="Image"
        className="fa fa-image"
        onClick={() => {
          const editor = store.editor;
          const mainSelection = editor.state.selection.main;
          const text =
            editor.state.sliceDoc(mainSelection.from, mainSelection.to) ||
            'image';
          editor.dispatch({
            changes: {
              from: mainSelection.from,
              to: mainSelection.to,
              insert: `![${text}](https://chuntaoliu.com/markdown-plus/icon.svg)`,
            },
          });
          editor.focus();
        }}
      ></i>
      <i
        title="Code"
        className="fa fa-code"
        onClick={() => {
          const editor = store.editor;
          const mainSelection = editor.state.selection.main;
          const text =
            editor.state.sliceDoc(mainSelection.from, mainSelection.to) ||
            "console.log('Hello, world!');";
          editor.dispatch({
            changes: {
              from: mainSelection.from,
              to: mainSelection.to,
              insert: `\n\`\`\`\n${text}\n\`\`\`\n`,
            },
          });
          editor.focus();
        }}
      ></i>
      <i
        title="Table"
        className="fa fa-table"
        onClick={() => {
          const sample = `
          header 1 | header 2
---|---
row 1 col 1 | row 1 col 2
row 2 col 1 | row 2 col 2`.trim();
          const cursor = store.editor.getCursor();
          if (cursor.ch === 0) {
            // cursor is at line start
            store.editor.replaceSelection(`\n${sample}\n\n`);
          } else {
            store.editor.setCursor({
              line: cursor.line,
              ch: store.editor.getLine(cursor.line).length,
            }); // navigate to line end
            store.editor.replaceSelection(`\n\n${sample}\n`);
          }
        }}
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
        onClick={() => {
          const text = store.editor.getSelection().trim() || 'E = mc^2';
          store.editor.replaceSelection(`\n\`\`\`katex\n${text}\n\`\`\`\n`);
        }}
      ></i>
      <i
        title="Flowchart"
        className="fa fa-long-arrow-right"
        onClick={() => mermaidClicked('graph LR\nA-->B')}
      ></i>
      <i
        title="Sequence diagram"
        className="fa fa-exchange"
        onClick={() =>
          mermaidClicked('sequenceDiagram\nA->>B: How are you?\nB->>A: Great!')
        }
      ></i>
      <i
        title="Gantt diagram"
        className="fa fa-sliders"
        onClick={() =>
          mermaidClicked(
            `gantt
dateFormat YYYY-MM-DD
section S1
T1: 2014-01-01, 9d
section S2
T2: 2014-01-11, 9d
section S3
T3: 2014-01-02, 9d`,
          )
        }
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
    </div>
  );
});

export default Toolbar;
