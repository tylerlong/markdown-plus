import React, { useEffect } from 'react';
import { Button, Modal, Select } from 'antd';
import { auto } from 'manate/react';
import { autoRun } from 'manate';

import iconUrl from '../icon.svg';
import { Store } from '../store';
import { savePreferences } from '../preferences';
import { themes } from '../utils';

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
      store.layout.sizePane('east', preferences.editorVersusPreview);
      store.editor.setOption('theme', preferences.editorTheme);
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
              value={preferences.showToolbar}
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ]}
              onChange={(value) => (preferences.showToolbar = value)}
            />
          </div>
          <div>
            Editor : Preview{' '}
            <Select
              value={preferences.editorVersusPreview}
              options={[
                { value: '100%', label: '0 : 1' },
                { value: '66%', label: '1 : 2' },
                { value: '50%', label: '1 : 1' },
                { value: '33%', label: '2 : 1' },

                // jQuery Layout bug. set preview width to "1" to hide it
                { value: '1', label: '1 : 0' },
              ]}
              onChange={(value) => (preferences.editorVersusPreview = value)}
            />
          </div>
          <div>
            Editor theme:{' '}
            <Select
              value={preferences.editorTheme}
              options={themes.map((theme) => ({ value: theme, label: theme }))}
              onChange={(value) => (preferences.editorTheme = value)}
            />
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
