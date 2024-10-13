import { auto } from 'manate/react';
import React, { useEffect } from 'react';
import waitFor from 'wait-for-async';

const Preview = auto(() => {
  useEffect(() => {
    // scroll past end
    const preview = document.querySelector('#preview') as HTMLElement;
    const leftPanel = document.querySelector('#left-panel') as HTMLElement;
    const lineHeight = parseInt(getComputedStyle(preview).lineHeight, 10);
    preview.style.paddingBottom = `${leftPanel.offsetHeight - lineHeight}px`;

    const scrollToHash = async () => {
      if (window.location.hash.length === 0) {
        return;
      }
      const r = await waitFor({
        interval: 100,
        times: 30,
        condition: () => document.querySelector(window.location.hash) !== null,
      });
      if (!r) {
        return;
      }
      const linkElement = document.querySelector(
        window.location.hash,
      ) as HTMLElement;
      const rightPanel = document.querySelector('#right-panel');
      rightPanel.scrollTop = linkElement.offsetTop;

      // first time scroll `store.editor.heightAtLine(xxx, 'local')` value is wrong
      // trigger again after 300ms
      // todo: it is a codemirror bug, maybe latest version has fixed this issue
      setTimeout(() => {
        rightPanel.scrollTop = linkElement.offsetTop - 1;
        rightPanel.scrollTop = linkElement.offsetTop;
      }, 300);
    };
    scrollToHash();
  }, []);
  return <article className="markdown-body" id="preview"></article>;
});

export default Preview;
