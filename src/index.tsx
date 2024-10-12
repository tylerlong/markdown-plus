import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';

import App from './components/app';
import store from './store';

const root = createRoot(document.getElementById('root'));
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
