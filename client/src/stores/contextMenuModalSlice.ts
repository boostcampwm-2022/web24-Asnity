import type { CommunitySummary } from '@apis/community';
import type { StateCreator } from 'zustand';

import { immer } from 'zustand/middleware/immer';

export interface ContextMenuModalBase {
  x: number;
  y: number;
  isOpen: boolean;
}

export interface CommunityContextMenuModal extends ContextMenuModalBase {
  data: CommunitySummary;
  type: 'community';
}

export interface ChannelContextMenuModal extends ContextMenuModalBase {
  data: CommunitySummary; // TODO: 채널 모달 타입으로 바꿔야 함.
  type: 'channel';
}

export interface InitialContextMenuModal extends ContextMenuModalBase {
  data: null;
  type: null;
}

export type ContextMenuModal =
  | InitialContextMenuModal
  | ChannelContextMenuModal
  | CommunityContextMenuModal;

export type OpenContextMenuModal = ({
  data,
  x,
  y,
  type,
}: Omit<CommunityContextMenuModal | ChannelContextMenuModal, 'isOpen'>) => void;

export interface ContextMenuModalSlice {
  contextMenuModal: ContextMenuModal;
  openContextMenuModal: OpenContextMenuModal;
  closeContextMenuModal: () => void;
}

const initialContextMenuModalValue = {
  data: null,
  type: null,
  isOpen: false,
  x: 0,
  y: 0,
} as const;

export const contextMenuModalSlice: StateCreator<
  ContextMenuModalSlice,
  [],
  [['zustand/immer', never], ...[]],
  ContextMenuModalSlice
> = immer((set) => ({
  contextMenuModal: initialContextMenuModalValue,
  openContextMenuModal: ({ data, x, y, type }) =>
    set((state) => {
      state.contextMenuModal = {
        data,
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
