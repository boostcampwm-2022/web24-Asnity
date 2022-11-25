import type { StateCreator } from 'zustand';

export interface ModalSlice {
  createCommunityModal: {
    open: boolean;
  };
}

export const createModalSlice: StateCreator<ModalSlice, [], [], ModalSlice> = (
  set,
) => ({
  createCommunityModal: {
    open: false,
  },
});
