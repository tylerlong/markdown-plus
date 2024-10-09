import React, { useEffect } from 'react';
import { Button, Modal, Select } from 'antd';
import { auto } from 'manate/react';
import { autoRun } from 'manate';

import iconUrl from '../icon.svg';
import { Store } from '../store';
import { savePreferences } from '../preferences';

const Modals = auto((props: { store: Store }) => {
  console.log('render modals');
  const { store } = props;
  const { preferences } = store;
  useEffect(() => {
    const preferencesApplier = autoRun(store, () => {
      if (!store.editor || !store.layout) {
        return;
      }
      if (preferences.showToolbar) {
        store.layout.open('north');
      } else {
        store.layout.close('north');
      }
    });
    preferencesApplier.start();
    return () => {
      preferencesApplier.stop();
    };
  }, []);
  return (
    <>
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
          <input className="form-control" id="emoji-code" placeholder="smile" />
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

      {/* preferences modal */}
      <Modal
        open={store.modals.preferences.isOpen}
        closable={false}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                savePreferences();
                store.modals.preferences.close();
              }}
            >
              OK
            </Button>
          </div>
        }
        centered={true}
      >
        <div style={{ textAlign: 'center' }}>
          <p>
            <img src={iconUrl} width="64" />
          </p>
          <h2>Markdown Plus Preferences</h2>
          <div>
            Show toolbar:{' '}
            <Select
              value={store.preferences.showToolbar}
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ]}
              onChange={(value) => (preferences.showToolbar = value)}
            />
          </div>
          <div>
            Editor : Preview{' '}
            <select id="editor-versus-preview">
              <option value="100%">0 : 1</option>
              <option value="66.6%">1 : 2</option>
              <option value="50%">1 : 1</option>
              <option value="33.3%">2 : 1</option>
              <option value="1">1 : 0</option>
            </select>
          </div>
          <div>
            Editor theme:{' '}
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
          </div>
          <div>
            Editor font size:{' '}
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
          </div>
          <div>
            Key binding:{' '}
            <select id="key-binding">
              <option value="default">Default</option>
              <option value="sublime">Sublime</option>
              <option value="vim">Vim</option>
              <option value="emacs">Emacs</option>
            </select>
          </div>
          <div>
            Gantt diagram axis format:{' '}
            <input id="gantt-axis-format" placeholder="%Y-%m-%d" /> <br />
            <a
              href="https://github.com/mbostock/d3/wiki/Time-Formatting"
              target="_blank"
              rel="noreferrer"
            >
              Time formatting reference
            </a>
          </div>
          <div>
            Custom CSS files:{' '}
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
          </div>
          <div>
            Custom JS files:{' '}
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
          </div>
        </div>
      </Modal>

      {/* help modal */}
      <Modal
        open={store.modals.help.isOpen}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => store.modals.help.close()}
            >
              Close
            </Button>
          </div>
        }
        onCancel={() => store.modals.help.close()}
        maskClosable={true}
        centered={true}
      >
        <div style={{ textAlign: 'center' }}>
          <p>
            <img src={iconUrl} width="64" />
          </p>
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
        </div>
      </Modal>

      {/* about modal */}
      <Modal
        open={store.modals.about.isOpen}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => store.modals.about.close()}
            >
              Close
            </Button>
          </div>
        }
        onCancel={() => store.modals.about.close()}
        maskClosable={true}
        centered={true}
      >
        <div style={{ textAlign: 'center' }}>
          <p>
            <img src={iconUrl} width="64" />
          </p>
          <h2>Markdown Plus</h2>
          <p>Version 3.x</p>
          <p>Markdown editor with extra features</p>
          <p>
            Copyright © 2015 - 2024{' '}
            <a
              href="https://github.com/tylerlong"
              target="_blank"
              rel="noreferrer"
            >
              Tyler Liu
            </a>
          </p>
          <p>
            Home page:{' '}
            <a
              href="https://github.com/tylerlong/markdown-plus"
              target="_blank"
              rel="noreferrer"
            >
              Home page
            </a>
          </p>
        </div>
      </Modal>
    </>
  );
});

export default Modals;
