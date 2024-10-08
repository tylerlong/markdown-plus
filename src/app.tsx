import React, { useEffect } from 'react';

import markdownUrl from './sample.md';
import { createEditor } from './editor';
import { syncPreview } from './sync_scroll';
import { createLayout } from './layout';
import { init } from './init';
import { initPreferences } from './preferences';
import store from './store';
import { loadScript } from './utils';

const main = async () => {
  await loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/remodal/1.1.1/remodal.min.js',
  );
  await loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.0/jquery-ui.min.js',
  );
  await loadScript(
    'https://cdn.jsdelivr.net/jquery.layout/1.4.3/jquery.layout.min.js',
  );

  // create editor
  const editor = createEditor();
  store.editor = editor;
  editor.on('scroll', () => {
    syncPreview();
  });

  // create layout
  const layout = createLayout();
  store.layout = layout;

  init();
  initPreferences();
  const r = await fetch(markdownUrl);
  const data = await r.text();
  editor.setValue(data);
  setTimeout(() => {
    // scroll to hash element
    if (window.location.hash.length > 0) {
      const previewPanel = document.querySelector('.ui-layout-east');
      const linkElement = document.querySelector(
        window.location.hash,
      ) as HTMLElement;
      if (linkElement) {
        previewPanel.scrollTop = linkElement.offsetTop;
        // first time scroll `store.editor.heightAtLine(xxx, 'local')` value is wrong
        // trigger again after 300ms
        // it is a codemirror bug, maybe latest version has fixed this issue
        setTimeout(() => {
          previewPanel.scrollTop = linkElement.offsetTop - 1;
          previewPanel.scrollTop = linkElement.offsetTop;
        }, 300);
      }
    }
  }, 3000);
};

const App = () => {
  useEffect(() => {
    main();
  }, []);
  return (
    <div id="mdp-container" style={{ height: '99%' }}>
      <div className="ui-layout-north">
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
            data-remodal-target="emoji-modal"
          ></i>
          <i
            title="Font awesome"
            className="fa fa-flag-o"
            data-remodal-target="fa-modal"
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
            data-remodal-target="preferences-modal"
          ></i>
          <i
            title="Help"
            className="fa fa-question-circle"
            data-remodal-target="help-modal"
          ></i>
          <i
            title="About"
            className="fa fa-info-circle"
            data-remodal-target="about-modal"
          ></i>
        </div>
      </div>
      <div className="ui-layout-center">
        <textarea id="editor"></textarea>
        {/* <!-- editor --> */}
        <div className="remodal" id="emoji-modal" data-remodal-id="emoji-modal">
          {/* <!-- emoji modal --> */}
          <h2>Please enter an emoji code:</h2>
          <p>
            {`Examples: "smile", "whale", "santa", "panda_face", "dog", "truck"
            ...`}
          </p>
          <p>
            For a complete list, please check
            <a
              href="http://www.emoji-cheat-sheet.com/"
              target="_blank"
              rel="noreferrer"
            >
              Emoji Cheat Sheet
            </a>
            .
          </p>
          <p>
            <input
              className="form-control"
              id="emoji-code"
              placeholder="smile"
            />
          </p>
          <br />
          <a data-remodal-action="cancel" className="remodal-cancel">
            Cancel
          </a>
          <a
            data-remodal-action="confirm"
            className="remodal-confirm"
            id="emoji-confirm"
          >
            OK
          </a>
        </div>
        <div className="remodal" id="fa-modal" data-remodal-id="fa-modal">
          {/* <!-- Font Awesome modal --> */}
          <h2>Please enter a Font Awesome code:</h2>
          <p>
            {`Examples: "cloud", "flag", "car", "truck", "heart", "dollar" ...`}
          </p>
          <p>
            For a complete list, please check
            <a
              href="http://fontawesome.io/icons/"
              target="_blank"
              rel="noreferrer"
            >
              Font Awesome Icons
            </a>
            .
          </p>
          <p>
            <input className="form-control" id="fa-code" placeholder="heart" />
          </p>
          <br />
          <a data-remodal-action="cancel" className="remodal-cancel">
            Cancel
          </a>
          <a
            data-remodal-action="confirm"
            className="remodal-confirm"
            id="fa-confirm"
          >
            OK
          </a>
        </div>
        <div
          className="remodal"
          id="preferences-modal"
          data-remodal-id="preferences-modal"
          data-remodal-options="closeOnEscape: false, closeOnCancel: false, closeOnOutsideClick: false"
        >
          {/* <!-- Preferences modal --> */}
          <img src="icon.svg" width="64" />
          <h2>Markdown Plus Preferences</h2>
          <p>
            Show toolbar:
            <select id="show-toolbar">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </p>
          <p>
            Editor : Preview
            <select id="editor-versus-preview">
              <option value="100%">0 : 1</option>
              <option value="66.6%">1 : 2</option>
              <option value="50%">1 : 1</option>
              <option value="33.3%">2 : 1</option>
              <option value="1">1 : 0</option>
            </select>
          </p>
          <p>
            Editor theme:
            <select id="editor-theme">
              <option value="3024-day">3024-day</option>
              <option value="3024-night">3024-night</option>
              <option value="abcdef">abcdef</option>
              <option value="ambiance-mobile">ambiance-mobile</option>
              <option value="ambiance">ambiance</option>
              <option value="base16-dark">base16-dark</option>
              <option value="base16-light">base16-light</option>
              <option value="bespin">bespin</option>
              <option value="blackboard">blackboard</option>
              <option value="cobalt">cobalt</option>
              <option value="colorforth">colorforth</option>
              <option value="default">default</option>
              <option value="dracula">dracula</option>
              <option value="duotone-dark">duotone-dark</option>
              <option value="duotone-light">duotone-light</option>
              <option value="eclipse">eclipse</option>
              <option value="elegant">elegant</option>
              <option value="erlang-dark">erlang-dark</option>
              <option value="hopscotch">hopscotch</option>
              <option value="icecoder">icecoder</option>
              <option value="isotope">isotope</option>
              <option value="lesser-dark">lesser-dark</option>
              <option value="liquibyte">liquibyte</option>
              <option value="material">material</option>
              <option value="mbo">mbo</option>
              <option value="mdn-like">mdn-like</option>
              <option value="midnight">midnight</option>
              <option value="monokai">monokai</option>
              <option value="neat">neat</option>
              <option value="neo">neo</option>
              <option value="night">night</option>
              <option value="panda-syntax">panda-syntax</option>
              <option value="paraiso-dark">paraiso-dark</option>
              <option value="paraiso-light">paraiso-light</option>
              <option value="pastel-on-dark">pastel-on-dark</option>
              <option value="railscasts">railscasts</option>
              <option value="rubyblue">rubyblue</option>
              <option value="seti">seti</option>
              <option value="solarized">solarized</option>
              <option value="the-matrix">the-matrix</option>
              <option value="tomorrow-night-bright">
                tomorrow-night-bright
              </option>
              <option value="tomorrow-night-eighties">
                tomorrow-night-eighties
              </option>
              <option value="ttcn">ttcn</option>
              <option value="twilight">twilight</option>
              <option value="vibrant-ink">vibrant-ink</option>
              <option value="xq-dark">xq-dark</option>
              <option value="xq-light">xq-light</option>
              <option value="yeti">yeti</option>
              <option value="zenburn">zenburn</option>
            </select>
          </p>
          <p>
            Editor font size:
            <select id="editor-font-size">
              <option value="8">8px</option>
              <option value="9">9px</option>
              <option value="10">10px</option>
              <option value="11">11px</option>
              <option value="12">12px</option>
              <option value="13">13px</option>
              <option value="14">14px</option>
              <option value="15">15px</option>
              <option value="16">16px</option>
              <option value="17">17px</option>
              <option value="18">18px</option>
              <option value="20">20px</option>
              <option value="24">24px</option>
              <option value="32">32px</option>
              <option value="48">48px</option>
              <option value="64">64px</option>
            </select>
          </p>
          <p>
            Key binding:
            <select id="key-binding">
              <option value="default">Default</option>
              <option value="sublime">Sublime</option>
              <option value="vim">Vim</option>
              <option value="emacs">Emacs</option>
            </select>
          </p>
          <p>
            Gantt diagram axis format:
            <input id="gantt-axis-format" placeholder="%Y-%m-%d" /> <br />
            <a
              href="https://github.com/mbostock/d3/wiki/Time-Formatting"
              target="_blank"
              rel="noreferrer"
            >
              Time formatting reference
            </a>
          </p>
          <p>
            Custom CSS files:
            <textarea
              id="custom-css-files"
              wrap="off"
              placeholder="https://cdn.example.com/file.css"
              title="Multiple files should be separated by line breaks"
            ></textarea>
            <br />
            <span className="hint">
              (You need to restart the editor to apply the CSS files)
            </span>
            <br />
            <a
              href="https://github.com/tylingsoft/markdown-plus-themes"
              target="_blank"
              rel="noreferrer"
            >
              Markdown Plus themes
            </a>
          </p>
          <p>
            Custom JS files:
            <textarea
              id="custom-js-files"
              wrap="off"
              placeholder="https://cdn.example.com/file.js"
              title="Multiple files should be separated by line breaks"
            ></textarea>
            <br />
            <span className="hint">
              (You need to restart the editor to apply the JS files)
            </span>
            <br />
            <a
              href="https://github.com/tylingsoft/markdown-plus-plugins"
              target="_blank"
              rel="noreferrer"
            >
              Markdown Plus plugins
            </a>
          </p>
          <br />
          <a data-remodal-action="confirm" className="remodal-confirm">
            OK
          </a>
        </div>
        <div className="remodal" data-remodal-id="help-modal">
          {/* <!-- help modal --> */}
          <img src="icon.svg" width="64" />
          <h2>Markdown Plus help</h2>
          <p>
            <a
              href="https://chuntaoliu.com/markdown-plus/"
              target="_blank"
              rel="noreferrer"
            >
              Online Sample
            </a>
          </p>
          <p>
            <a
              href="https://guides.github.com/features/mastering-markdown/"
              target="_blank"
              rel="noreferrer"
            >
              Markdown Basics
            </a>
          </p>
          <p>
            <a
              href="https://help.github.com/articles/github-flavored-markdown/"
              target="_blank"
              rel="noreferrer"
            >
              GitHub Flavored Markdown
            </a>
          </p>
          <br />
          <a data-remodal-action="confirm" className="remodal-confirm">
            OK
          </a>
        </div>
        <div className="remodal" data-remodal-id="about-modal">
          {/* <!-- about modal --> */}
          <img src="icon.svg" width="64" />
          <h2>Markdown Plus</h2>
          Version 2.x
          <p>Markdown editor with extra features.</p>
          <p>
            Copyright © 2015 - 2024
            <a
              href="https://github.com/tylerlong"
              target="_blank"
              rel="noreferrer"
            >
              Tyler Liu
            </a>
            .
          </p>
          <p>
            Home page:
            <a
              href="https://github.com/tylerlong/markdown-plus"
              target="_blank"
              rel="noreferrer"
            >
              Home page
            </a>
            .
          </p>
          <br />
          <a data-remodal-action="confirm" className="remodal-confirm">
            OK
          </a>
        </div>
      </div>
      <div className="ui-layout-east">
        <article className="markdown-body" id="preview"></article>
      </div>
    </div>
  );
};

export default App;
