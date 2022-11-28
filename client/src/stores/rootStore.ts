import type { AlertModalSlice } from '@stores/alertModalSlice';
import type { CommonModalSlice } from '@stores/commonModalSlice';
import type { ContextMenuModalSlice } from '@stores/contextMenuModalSlice';
import type { CreateCommunityModalSlice } from '@stores/createCommunityModalSlice';

import { alertModalSlice } from '@stores/alertModalSlice';
import { commonModalSlice } from '@stores/commonModalSlice';
import { contextMenuModalSlice } from '@stores/contextMenuModalSlice';
import { createCommunityModalSlice } from '@stores/createCommunityModalSlice';
import store from 'zustand';
import { devtools } from 'zustand/middleware';

export type Store = CreateCommunityModalSlice &
  ContextMenuModalSlice &
  AlertModalSlice &
  CommonModalSlice;

export const useRootStore = store<Store>()(
  devtools((...a) => ({
    ...createCommunityModalSlice(...a),
    ...contextMenuModalSlice(...a),
    ...alertModalSlice(...a),
    ...commonModalSlice(...a),
  })),
);
