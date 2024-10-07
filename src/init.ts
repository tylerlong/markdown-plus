import $ from 'jquery';
import Cookies from 'js-cookie';

import { syncEditor } from './sync_scroll';
import { lazyChange, lazyResize } from './util';
import { registerToolBarEvents } from './toolbar';
import store from './store';

export const init = () => {
  // modals
  $(document).on('closed', '.remodal', () => {
    store.editor.focus();
  });

  $(() => {
    // keep layout percentage after window resizing
    $(window).resize(() => {
      lazyResize();
    });

    // setup toolbar
    registerToolBarEvents();

    // load themes
    let customCssFiles = Cookies.get('custom-css-files');
    if (customCssFiles === undefined) {
      customCssFiles = '';
    }
    customCssFiles.split('\n').forEach((cssfile) => {
      cssfile = cssfile.trim();
      if (cssfile.length > 0) {
        $('head').append('<link rel="stylesheet" href="' + cssfile + '"/>');
      }
    });

    // load plugins
    let customJsFiles = Cookies.get('custom-js-files');
    if (customJsFiles === undefined) {
      customJsFiles = '';
    }
    customJsFiles.split('\n').forEach((jsFile) => {
      jsFile = jsFile.trim();
      if (jsFile.length > 0) {
        $('head').append('<script src="' + jsFile + '"></script>');
      }
    });

    // scroll past end
    $('article#preview').css(
      'padding-bottom',
      $('.ui-layout-east').height() -
        parseInt($('article#preview').css('line-height'), 10) +
        1 +
        'px',
    );

    // left scroll with right
    $('.ui-layout-east').scroll(() => {
      syncEditor();
    });

    // whenever user changes markdown...
    store.editor.on('changes', () => {
      lazyChange();
    });
  });
};
