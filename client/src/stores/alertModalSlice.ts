import type { StateCreator } from 'zustand';

import { immer } from 'zustand/middleware/immer';

export interface AlertModal {
  description: string;
  isOpen: boolean;
  onCancel: (() => void) | null;
  onSubmit: (() => void) | null;
}

type OpenAlertModal = ({
  description,
  onCancel,
  onSubmit,
}: Omit<AlertModal, 'isOpen'>) => void;

export interface AlertModalSlice {
  alertModal: AlertModal;
  openAlertModal: OpenAlertModal;
  closeAlertModal: () => void;
}

const initialAlertModalValue = {
  isOpen: false,
  description: '',
  onSubmit: null,
  onCancel: null,
};

export const alertModalSlice: StateCreator<
  AlertModalSlice,
  [],
  [['zustand/immer', never], ...[]],
  AlertModalSlice
> = immer((set) => ({
  alertModal: initialAlertModalValue,
  openAlertModal: ({ description, onCancel, onSubmit }) =>
    set((state) => {
      state.alertModal = {
        description,
        onCancel,
        onSubmit,
        isOpen: true,
      };
    }),
  closeAlertModal: () =>
    set((state) => {
      state.alertModal = initialAlertModalValue;
    }),
}));
