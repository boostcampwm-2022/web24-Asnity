import type Scrollbars from 'react-custom-scrollbars-2';
import type { StateCreator } from 'zustand';

import { devtools } from 'zustand/middleware';

export type SetChatScrollbar = (newScrollbar?: Scrollbars | null) => void;

export interface ChatScrollbarSlice {
  chatScrollbar?: Scrollbars | null;
  setChatScrollbar: SetChatScrollbar;
}

const initialChatScrollbar = null;

export const chatScrollbarSlice: StateCreator<
  ChatScrollbarSlice,
  [],
  [['zustand/devtools', never], ...[]],
  ChatScrollbarSlice
> = devtools((set) => ({
  chatScrollbar: initialChatScrollbar,
  setChatScrollbar: (chatScrollbar) => set({ chatScrollbar }),
}));
