import type { CSSProperties, ReactNode } from 'react';
import type { StateCreator } from 'zustand';

import { immer } from 'zustand/middleware/immer';

type OverlayBackground = 'white' | 'black' | 'transparent';

export interface CommonModal {
  isOpen: boolean;
  overlayBackground: OverlayBackground;
  contentWrapperStyle?: CSSProperties;
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
  content: undefined,
  overlayBackground: 'transparent',
  onCancel: undefined,
  onSubmit: undefined,
  contentWrapperStyle: undefined,
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
