import type { StateCreator } from 'zustand';

import { immer } from 'zustand/middleware/immer';

export interface CreateCommunityModalSlice {
  createCommunityModal: {
    isOpen: boolean;
  };
  openCreateCommunityModal: () => void;
  closeCreateCommunityModal: () => void;
}

export const createCommunityModalSlice: StateCreator<
  CreateCommunityModalSlice,
  [],
  [['zustand/immer', never], ...[]],
  CreateCommunityModalSlice
> = immer((set) => ({
  createCommunityModal: {
    isOpen: false,
  },
  openCreateCommunityModal: () =>
    set((state) => {
      state.createCommunityModal.isOpen = true;
    }),
  closeCreateCommunityModal: () =>
    set((state) => {
      state.createCommunityModal.isOpen = false;
    }),
}));
