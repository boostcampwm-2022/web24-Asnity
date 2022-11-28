import type { ReactNode } from 'react';
import type { StateCreator } from 'zustand';

import { immer } from 'zustand/middleware/immer';

type OverlayBackground = 'white' | 'black' | 'transparent';

export interface CommonModal {
  isOpen: boolean;
  data?: unknown;
  overlayBackground: OverlayBackground;
  x: number | string;
  y: number | string;
  transform?: string;
  content?: ReactNode;
  onCancel?: () => void;
  onSubmit?: () => void;
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

const initialCommonModalValue = {
  isOpen: false,
  data: undefined,
  content: undefined,
  overlayBackground: 'transparent',
  onCancel: undefined,
  onSubmit: undefined,
  transform: undefined,
  x: 0,
  y: 0,
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
