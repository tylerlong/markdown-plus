import $ from 'jquery';

import markdownUrl from './sample.md';

global.$ = global.jQuery = $;

const loadScript = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject();
    };
    document.head.appendChild(script);
  });
};

// load sample text and get anchor links correct
$(async () => {
  await loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/remodal/1.1.1/remodal.min.js',
  );
  await loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.0/jquery-ui.min.js',
  );
  await loadScript(
    'https://cdn.jsdelivr.net/jquery.layout/1.4.3/jquery.layout.min.js',
  );

  const editor = (await import('./editor')).default;
  await import('./init');
  await import('./preferences');
  $.get(markdownUrl, (data) => {
    editor.setValue(data);
    setTimeout(() => {
      // a little gap to top
      window.addEventListener('hashchange', () => {
        $('.ui-layout-east').scrollTop($('.ui-layout-east').scrollTop() - 6);
      });

      // scroll to hash element
      if (window.location.hash.length > 0) {
        $('.ui-layout-east').scrollTop(
          $(window.location.hash).offset().top - 30,
        );
      }
    }, 3000);
  });
});
