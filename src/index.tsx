import $ from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';

global.$ = global.jQuery = $;

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
