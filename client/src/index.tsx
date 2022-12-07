import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

import App from './App';
import queryClient from './queryClient';
import './index.css';

if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browsers');

  worker.start();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

// https://github.com/fkhadra/react-toastify/issues/195#issuecomment-860722903
// https://grand-beanie-e57.notion.site/react-toastify-import-css-2b14956185394af797bc1c1842207473
injectStyle();

root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools />
    <App />
    <ToastContainer />
  </QueryClientProvider>,
);
