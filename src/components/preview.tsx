import { auto } from 'manate/react';
import React, { useEffect } from 'react';
import $ from 'jquery';

const Preview = auto(() => {
  useEffect(() => {
    // scroll past end
    $('article#preview').css(
      'padding-bottom',
      $('#left-panel').height() -
        parseInt($('article#preview').css('line-height'), 10) +
        'px',
    );

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
