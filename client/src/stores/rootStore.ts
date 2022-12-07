import type { ChatScrollbarSlice } from '@stores/chatScrollBarSlice';
import type { CommonModalSlice } from '@stores/commonModalSlice';
import type { ContextMenuModalSlice } from '@stores/contextMenuModalSlice';

import { chatScrollbarSlice } from '@stores/chatScrollBarSlice';
import { commonModalSlice } from '@stores/commonModalSlice';
import { contextMenuModalSlice } from '@stores/contextMenuModalSlice';
import store from 'zustand';
import { devtools } from 'zustand/middleware';

export type Store = ContextMenuModalSlice &
  CommonModalSlice &
  ChatScrollbarSlice;

export const useRootStore = store<Store>()(
  devtools((...a) => ({
    ...contextMenuModalSlice(...a),
    ...commonModalSlice(...a),
    ...chatScrollbarSlice(...a),
  })),
);
