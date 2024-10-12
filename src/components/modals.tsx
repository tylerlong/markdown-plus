import React, { useEffect, useRef, useState } from 'react';
import { Button, Divider, Input, InputRef, Modal, Select } from 'antd';
import { auto } from 'manate/react';
import { autoRun } from 'manate';
import mdc from 'markdown-core/src/index-browser';

import iconUrl from '../icon.svg';
import { Store } from '../store';

const themes = [
  '3024-day',
  '3024-night',
  'abcdef',
  'ambiance-mobile',
  'ambiance',
  'base16-dark',
  'base16-light',
  'bespin',
  'blackboard',
  'cobalt',
  'colorforth',
  'default',
  'dracula',
  'duotone-dark',
  'duotone-light',
  'eclipse',
  'elegant',
  'erlang-dark',
  'hopscotch',
  'icecoder',
  'isotope',
  'lesser-dark',
  'liquibyte',
  'material',
  'mbo',
  'mdn-like',
  'midnight',
  'monokai',
  'neat',
  'neo',
  'night',
  'panda-syntax',
  'paraiso-dark',
  'paraiso-light',
  'pastel-on-dark',
  'railscasts',
  'rubyblue',
  'seti',
  'solarized',
  'the-matrix',
  'tomorrow-night-bright',
  'tomorrow-night-eighties',
  'ttcn',
  'twilight',
  'vibrant-ink',
  'xq-dark',
  'xq-light',
  'yeti',
  'zenburn',
];

const Modals = auto((props: { store: Store }) => {
  console.log('render modals');
  const { store } = props;
  const { preferences, modals } = store;
  const emojiInput = useRef<InputRef>(null);
  const faInput = useRef<InputRef>(null);
  useEffect(() => {
    const preferencesApplier = autoRun(store, () => {
      if (!store.editor) {
        return;
      }
      store.editor.setOption('theme', preferences.editorTheme);
      (document.querySelector('.CodeMirror') as HTMLDivElement).style.fontSize =
        `${preferences.editorFontSize}px`;
      store.editor.setOption('keyMap', preferences.keyBinding);

      mdc.mermaid.gantt.axisFormat(preferences.ganttAxisFormat);
    });
    preferencesApplier.start();
    return () => {
      preferencesApplier.stop();
    };
  }, []);
  const [emojiValue, setEmojiValue] = useState('');
  const [faValue, setFaValue] = useState('');
  const handleEmojiOK = () => {
    modals.emoji.close();
    const value = emojiValue.trim();
    if (value.length > 0) {
      store.editor.replaceSelection(`:${value}:`);
    }
    setEmojiValue('');
  };
  const handleFaOK = () => {
    modals.fontAwesome.close();
    const value = faValue.trim();
    if (value.length > 0) {
      store.editor.replaceSelection(`:fa-${value}:`);
    }
    setFaValue('');
  };
  return (
    <>
      {/* emoji modal */}
      <Modal
        open={modals.emoji.isOpen}
        onCancel={() => modals.emoji.close()}
        onOk={() => handleEmojiOK()}
        maskClosable={true}
        centered={true}
        afterOpenChange={(open) => {
          if (open) {
            emojiInput.current?.focus();
          }
        }}
      >
        <div style={{ textAlign: 'center' }}>
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
          <div>
            <Input
              ref={emojiInput}
              value={emojiValue}
              onChange={(e) => setEmojiValue(e.target.value)}
              placeholder="smile"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleEmojiOK();
                }
              }}
            />
          </div>
        </div>
      </Modal>

      {/* font awesome modal */}
      <Modal
        open={modals.fontAwesome.isOpen}
        onCancel={() => modals.fontAwesome.close()}
        onOk={() => handleFaOK()}
        maskClosable={true}
        centered={true}
        afterOpenChange={(open) => {
          if (open) {
            faInput.current?.focus();
          }
        }}
      >
        <div style={{ textAlign: 'center' }}>
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
          <div>
            <Input
              ref={faInput}
              placeholder="heart"
              value={faValue}
              onChange={(e) => setFaValue(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleFaOK();
                }
              }}
            />
          </div>
        </div>
      </Modal>

      {/* preferences modal */}
      <Modal
        open={modals.preferences.isOpen}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                modals.preferences.close();
              }}
            >
              Save
            </Button>
          </div>
        }
        onCancel={() => modals.preferences.close()}
        maskClosable={true}
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
              value={preferences.editorVsPreview}
              options={[
                { value: '0fr 6px 1fr', label: '0 : 1' },
                { value: '1fr 6px 2fr', label: '1 : 2' },
                { value: '1fr 6px 1fr', label: '1 : 1' },
                { value: '2fr 6px 1fr', label: '2 : 1' },
                { value: '1fr 6px 0fr', label: '1 : 0' },
              ]}
              onChange={(value) => (preferences.editorVsPreview = value)}
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
            <Select
              value={preferences.editorFontSize}
              options={[
                8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 24, 32, 48, 64,
              ].map((i) => ({ value: i, label: `${i}px` }))}
              onChange={(value) => (preferences.editorFontSize = value)}
            />
          </div>
          <div>
            Key binding:{' '}
            <Select
              value={preferences.keyBinding}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'sublime', label: 'Sublime' },
                { value: 'vim', label: 'Vim' },
                { value: 'emacs', label: 'Emacs' },
              ]}
              onChange={(value) => (preferences.keyBinding = value)}
            />
          </div>
          <Divider plain>
            You need to restart the editor to apply settings below
          </Divider>
          <div>
            Gantt diagram axis format:{' '}
            <Input
              placeholder="%Y-%m-%d"
              value={preferences.ganttAxisFormat}
              onChange={(e) => (preferences.ganttAxisFormat = e.target.value)}
            />
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
            <Input.TextArea
              value={preferences.customCssFiles}
              onChange={(e) => (preferences.customCssFiles = e.target.value)}
              wrap="off"
              placeholder="https://cdn.example.com/file.css
Please enter each link on a new line."
            />
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
            <Input.TextArea
              value={preferences.customJsFiles}
              onChange={(e) => (preferences.customJsFiles = e.target.value)}
              wrap="off"
              placeholder="https://cdn.example.com/file.js
Please enter each link on a new line."
            />
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
        open={modals.help.isOpen}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => modals.help.close()}
            >
              Close
            </Button>
          </div>
        }
        onCancel={() => modals.help.close()}
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
        open={modals.about.isOpen}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => modals.about.close()}
            >
              Close
            </Button>
          </div>
        }
        onCancel={() => modals.about.close()}
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
