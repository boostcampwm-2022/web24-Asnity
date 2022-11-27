import type { StateCreator } from 'zustand';

import { immer } from 'zustand/middleware/immer';

export interface AlertModal {
  description: string;
  isOpen: boolean;
  disabled: boolean;
  onCancel: (() => void) | null;
  onSubmit: (() => void) | null;
}

type OpenAlertModal = ({
  description,
  onCancel,
  onSubmit,
}: Omit<AlertModal, 'isOpen' | 'disabled'>) => void;

export interface AlertModalSlice {
  alertModal: AlertModal;
  openAlertModal: OpenAlertModal;
  closeAlertModal: () => void;
  disableAlertModal: () => void;
  enableAlertModal: () => void;
}

const initialAlertModalValue = {
  isOpen: false,
  description: '',
  onSubmit: null,
  onCancel: null,
  disabled: false,
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
        disabled: state.alertModal.disabled,
      };
    }),
  closeAlertModal: () =>
    set((state) => {
      state.alertModal = initialAlertModalValue;
    }),
  disableAlertModal: () =>
    set((state) => {
      state.alertModal.disabled = true;
    }),
  enableAlertModal: () =>
    set((state) => {
      state.alertModal.disabled = false;
    }),
}));
