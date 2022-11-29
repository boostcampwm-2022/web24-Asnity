import type { CommonModalSlice } from '@stores/commonModalSlice';
import type { ContextMenuModalSlice } from '@stores/contextMenuModalSlice';

import { commonModalSlice } from '@stores/commonModalSlice';
import { contextMenuModalSlice } from '@stores/contextMenuModalSlice';
import store from 'zustand';
import { devtools } from 'zustand/middleware';

export type Store = ContextMenuModalSlice & CommonModalSlice;

export const useRootStore = store<Store>()(
  devtools((...a) => ({
    ...contextMenuModalSlice(...a),
    ...commonModalSlice(...a),
  })),
);
