import $ from 'jquery';
import debounce from 'lodash/debounce';

import { syncEditor } from './sync_scroll';
import { lazyChange } from './utils';
import { registerToolBarEvents } from './toolbar';
import store from './store';

export const init = () => {
  // modals
  $(document).on('closed', '.remodal', () => {
    store.editor.focus();
  });

  // keep layout percentage after window resizing
  const lazyAdjustLayout = debounce(
    () => {
      store.layout.sizePane('east', store.preferences.editorVersusPreview);
    },
    1024,
    { leading: false, trailing: true },
  );
  $(window).resize(() => {
    lazyAdjustLayout();
  });

  // setup toolbar
  registerToolBarEvents();

  // apply themes
  store.preferences.customCssFiles.split('\n').forEach((cssfile) => {
    cssfile = cssfile.trim();
    if (cssfile.length > 0) {
      $('head').append('<link rel="stylesheet" href="' + cssfile + '"/>');
    }
  });

  // apply plugins
  store.preferences.customJsFiles.split('\n').forEach((jsFile) => {
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
};
