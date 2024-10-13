import { Input, InputRef, Modal } from 'antd';
import { auto } from 'manate/react';
import React, { useRef, useState } from 'react';

import { Store } from '../../store';

const promptModals = auto((props: { store: Store }) => {
  console.log('render prompt modals');
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
              href="https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md"
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
              href="https://github.com/gluons/Font-Awesome-Icon-Chars/blob/master/character-list/character-list.yaml"
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
    </>
  );
});

export default promptModals;
