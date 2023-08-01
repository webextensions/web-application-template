/* eslint-disable filenames/no-index */

import React from 'react';
import { createRoot } from 'react-dom/client'; // eslint-disable-line node/file-extension-in-import

import './index.css';

import { App } from './App/App.js';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
