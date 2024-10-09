import Cookies from 'js-cookie';
import $ from 'jquery';

import { lazyChange } from './utils';

const loadCustomFiles = () => {
  const customCssFiles = Cookies.get('custom-css-files') || '';
  $('textarea#custom-css-files').val(customCssFiles);

  const customJsFiles = Cookies.get('custom-js-files') || '';
  $('textarea#custom-js-files').val(customJsFiles);
};

export const loadPreferences = () => {
  loadCustomFiles();
};

export const savePreferences = () => {
  const customCssFiles = $('#custom-css-files').val().trim();
  Cookies.set('custom-css-files', customCssFiles, { expires: 10000 });
  const customJsFiles = $('#custom-js-files').val().trim();
  Cookies.set('custom-js-files', customJsFiles, { expires: 10000 });
  loadPreferences();
  lazyChange(); // trigger re-render
};
