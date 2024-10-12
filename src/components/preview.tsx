import { auto } from 'manate/react';
import React, { useEffect } from 'react';

const Preview = auto(() => {
  useEffect(() => {
    // scroll past end
    const preview = document.querySelector('#preview') as HTMLElement;
    const leftPanel = document.querySelector('#left-panel') as HTMLElement;
    const lineHeight = parseInt(getComputedStyle(preview).lineHeight, 10);
    preview.style.paddingBottom = `${leftPanel.offsetHeight - lineHeight}px`;

    // todo: precisely set the timing
    setTimeout(() => {
      // scroll to hash element
      if (window.location.hash.length > 0) {
        const previewPanel = document.querySelector('#preview').parentElement;
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
  }, []);
  return <article className="markdown-body" id="preview"></article>;
});

export default Preview;
