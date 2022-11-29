import type { AlertModalSlice } from '@stores/alertModalSlice';
import type { CommonModalSlice } from '@stores/commonModalSlice';
import type { ContextMenuModalSlice } from '@stores/contextMenuModalSlice';

import { alertModalSlice } from '@stores/alertModalSlice';
import { commonModalSlice } from '@stores/commonModalSlice';
import { contextMenuModalSlice } from '@stores/contextMenuModalSlice';
import store from 'zustand';
import { devtools } from 'zustand/middleware';

export type Store = ContextMenuModalSlice & AlertModalSlice & CommonModalSlice;

export const useRootStore = store<Store>()(
  devtools((...a) => ({
    ...contextMenuModalSlice(...a),
    ...alertModalSlice(...a),
    ...commonModalSlice(...a),
  })),
);
