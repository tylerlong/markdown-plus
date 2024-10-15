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
    };
    scrollToHash();
  }, []);
  return <article className="markdown-body" id="preview"></article>;
});

export default Preview;
