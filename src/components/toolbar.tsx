import { auto } from 'manate/react';
import React from 'react';

import { Store } from '../store';

const Toolbar = auto((props: { store: Store }) => {
  console.log('render toolbar');
  const { store } = props;
  const { modals } = store;
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
        title="Hide toolbar"
        className="fa fa-long-arrow-up"
        id="toggle-toolbar"
      ></i>
      <i
        title="Toggle editor"
        className="fa fa-long-arrow-left"
        id="toggle-editor"
      ></i>
      <i
        title="Toggle preview"
        className="fa fa-long-arrow-right"
        id="toggle-preview"
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
