import type { CreateCommunityModalSlice } from '@stores/createCommunityModalSlice';

import store from 'zustand';
import { devtools } from 'zustand/middleware';

import { createCommunityModalSlice } from './createCommunityModalSlice';

export type Store = CreateCommunityModalSlice;

export const useRootStore = store<Store>()(
  devtools((...a) => ({
    ...createCommunityModalSlice(...a),
  })),
);
