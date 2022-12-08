import type { CSSProperties, ReactNode } from 'react';
import type { StateCreator } from 'zustand';

import { immer } from 'zustand/middleware/immer';

export interface ContextMenuModal {
  isOpen: boolean;
  contentWrapperStyle?: CSSProperties;
  content?: ReactNode;
}

type SetContextMenuModal = (
  contextMenuModalState: Partial<ContextMenuModal>,
) => void;

type OpenContextMenuModal = (
  contextMenuModal: Partial<Omit<ContextMenuModal, 'isOpen'>>,
) => void;

export interface ContextMenuModalSlice {
  contextMenuModal: ContextMenuModal;
  setContextMenuModal: SetContextMenuModal;
  openContextMenuModal: OpenContextMenuModal;
  closeContextMenuModal: () => void;
}

const initialContextMenuModalValue = {
  isOpen: false,
  contentWrapperStyle: undefined,
  content: undefined,
} as const;

export const contextMenuModalSlice: StateCreator<
  ContextMenuModalSlice,
  [],
  [['zustand/immer', never], ...[]],
  ContextMenuModalSlice
> = immer((set) => ({
  contextMenuModal: initialContextMenuModalValue,
  setContextMenuModal: (contextMenuModalState) =>
    set((state) => {
      state.contextMenuModal = {
        ...state.contextMenuModal,
        ...contextMenuModalState,
      };
    }),
  openContextMenuModal: (contextMenuModalState) =>
    set((state) => {
      state.contextMenuModal = {
        ...state.contextMenuModal,
        ...contextMenuModalState,
        isOpen: true,
      };
    }),
  closeContextMenuModal: () =>
    set((state) => {
      state.contextMenuModal = initialContextMenuModalValue;
    }),
}));
