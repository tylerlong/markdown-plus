import $ from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';

import App from './components/app';
import store from './store';

global.$ = global.jQuery = $;

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#00b96b',
      },
    }}
  >
    <App store={store} />
  </ConfigProvider>,
);
