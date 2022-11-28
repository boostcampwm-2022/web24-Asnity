import type { ReactNode } from 'react';
import type { StateCreator } from 'zustand';

import { immer } from 'zustand/middleware/immer';

type OverlayBackground = 'white' | 'black' | 'transparent';

export interface CommonModal {
  isOpen: boolean;
  content: ReactNode;
  overlayBackground: OverlayBackground;
  onCancel: () => void;
  onSubmit: () => void;
}

type SetCommonModal = (commonModalState: Partial<CommonModal>) => void;
type OpenCommonModal = (
  commonModalState: Partial<Omit<CommonModal, 'isOpen'>>,
) => void;

export interface CommonModalSlice {
  commonModal: CommonModal;
  setCommonModal: SetCommonModal;
  openCommonModal: OpenCommonModal;
  closeCommonModal: () => void;
}

const defaultHandler = () => {};

const initialCommonModalValue = {
  isOpen: false,
  content: null,
  overlayBackground: 'transparent',
  onCancel: defaultHandler,
  onSubmit: defaultHandler,
} as const;

export const commonModalSlice: StateCreator<
  CommonModalSlice,
  [],
  [['zustand/immer', never], ...[]],
  CommonModalSlice
> = immer((set) => ({
  commonModal: initialCommonModalValue,
  setCommonModal: (commonModalState) =>
    set((state) => {
      state.commonModal = {
        ...state.commonModal,
        ...commonModalState,
      };
    }),
  openCommonModal: (commonModalState) =>
    set((state) => {
      state.commonModal = {
        ...state.commonModal,
        ...commonModalState,
        isOpen: true,
      };
    }),
  closeCommonModal: () =>
    set((state) => {
      state.commonModal = initialCommonModalValue;
    }),
}));
