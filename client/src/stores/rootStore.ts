import type { ModalSlice } from '@stores/modalSlice';

import store from 'zustand';
import { devtools } from 'zustand/middleware';

import { createModalSlice } from './modalSlice';

export type Store = ModalSlice;

export const useStore = store<Store>()(
  devtools((...a) => ({
    ...createModalSlice(...a),
  })),
);
