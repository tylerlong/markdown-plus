import $ from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';

import App from './components/app';
import store from './store';

global.$ = global.jQuery = $;

const root = createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#00b96b',
      },
      components: {
        Splitter: {
          splitBarSize: 6,
          resizeSpinnerSize: 64,
          splitTriggerSize: 12,
        },
      },
    }}
  >
    <App store={store} />
  </ConfigProvider>,
);
