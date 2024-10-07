import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import mdc from 'markdown-core/src/index-browser';
import store from './store';

export const getPreviewWidth = () => {
  let previewWidth = Cookies.get('editor-versus-preview');
  if (previewWidth === undefined) {
    previewWidth = '50%';
  }
  return previewWidth;
};

// neither editor or preview is hidden
export const getNormalPreviewWidth = () => {
  let previewWidth = getPreviewWidth();
  if (previewWidth === '1' || previewWidth === '100%') {
    previewWidth = '50%';
  }
  return previewWidth;
};

// user changes markdown text
export const lazyChange = debounce(
  () => {
    if (store.layout.panes.east.outerWidth() < 8) {
      // preview is hidden
      return; // no need to update preview if it's hidden
    }
    mdc.init(store.editor.getValue()); // realtime preview
  },
  1024,
  { leading: false, trailing: true },
);

// adjust layout according to percentage configuration
export const lazyResize = debounce(
  () => {
    store.layout.sizePane('east', getPreviewWidth());
  },
  1024,
  { leading: false, trailing: true },
);
