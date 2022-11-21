import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

import App from './App';
import './index.css';

if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browsers');

  worker.start();
}

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

/**
 * react-toastify import css 안되는 이슈
 * // TODO: 링크 업데이트하기
 */
injectStyle();

root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools />
    <App />
    <ToastContainer />
  </QueryClientProvider>,
);
