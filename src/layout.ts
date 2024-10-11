import $ from 'jquery';

import { lazyChange } from './utils';
import store from './store';

export const createLayout = () => {
  const layout = $('#mdp-container').layout({
    // create 3-panels layout
    resizerDblClickToggle: false,
    resizable: false,
    slidable: false,
    north: {
      togglerLength_open: 128,
      togglerLength_closed: 128,
      size: 22,
      togglerTip_open: 'Hide toolbar',
      togglerTip_closed: 'Show toolbar',
      onopen: () => {
        store.editor.focus();
      },
      onclose: () => {
        store.editor.focus();
      },
    },
    east: {
      resizable: true,
      togglerLength_open: 0,
      size: store.preferences.editorVsPreview,
      onresize: () => {
        lazyChange();
        store.editor.focus();
        $('article#preview').css(
          'padding-bottom',
          $('.ui-layout-east').height() -
            parseInt($('article#preview').css('line-height'), 10) +
            1 +
            'px',
        ); // scroll past end
      },
    },
  });
  return layout;
};
