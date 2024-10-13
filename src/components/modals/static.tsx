import { Button, Modal } from 'antd';
import { auto } from 'manate/react';
import React from 'react';

import iconUrl from '../../icon.svg';
import store from '../../store';

const StaticModals = auto((props: { modals: typeof store.modals }) => {
  const { modals } = props;
  return (
    <>
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

export default StaticModals;
