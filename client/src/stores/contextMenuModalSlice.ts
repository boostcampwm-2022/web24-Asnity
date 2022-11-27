import type { StateCreator } from 'zustand';

import { immer } from 'zustand/middleware/immer';

export type ContextMenuType = 'community' | 'channel' | null;

export interface ContextMenuModal {
  id: string | null;
  x: number;
  y: number;
  type: ContextMenuType;
  isOpen: boolean;
}
export type OpenContextMenuModal = ({
  id,
  x,
  y,
  type,
}: Omit<ContextMenuModal, 'isOpen'>) => void;

export interface ContextMenuModalSlice {
  contextMenuModal: ContextMenuModal;
  openContextMenuModal: OpenContextMenuModal;
  closeContextMenuModal: () => void;
}

const initialContextMenuModalValue = {
  id: null,
  type: null,
  isOpen: false,
  x: 0,
  y: 0,
};

export const contextMenuModalSlice: StateCreator<
  ContextMenuModalSlice,
  [],
  [['zustand/immer', never], ...[]],
  ContextMenuModalSlice
> = immer((set) => ({
  contextMenuModal: initialContextMenuModalValue,
  openContextMenuModal: ({ id, x, y, type }) =>
    set((state) => {
      state.contextMenuModal = {
        id,
        x,
        y,
        type,
        isOpen: true,
      };
    }),
  closeContextMenuModal: () =>
    set((state) => {
      state.contextMenuModal = initialContextMenuModalValue;
    }),
}));
