import { Button, Input, InputRef, Modal } from 'antd';
import { auto } from 'manate/react';
import React, { useRef, useState } from 'react';

import iconUrl from '../../icon.svg';
import { Store } from '../../store';
import PreferencesModal from './preferences';

const Modals = auto((props: { store: Store }) => {
  console.log('render modals');
  const { store } = props;
  const { modals } = store;
  const emojiInput = useRef<InputRef>(null);
  const faInput = useRef<InputRef>(null);
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

      <PreferencesModal store={store} />

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
