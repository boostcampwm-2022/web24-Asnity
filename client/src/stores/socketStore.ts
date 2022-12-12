import type ClientIO from '@sockets/ClientIO';

import store from 'zustand';
import { devtools } from 'zustand/middleware';

export type Sockets = Record<string, ClientIO>;

export type SocketStore = {
  sockets: Sockets;
  setSockets: (sockets: Sockets) => void;
  clearSockets: () => void;
};

const initialSockets = {};

export const useSocketStore = store<SocketStore>()(
  devtools((set, get) => ({
    sockets: initialSockets,
    setSockets: (sockets) => set({ sockets }),
    clearSockets: () => {
      const state = get();
      const { sockets } = state;

      Object.values(sockets).forEach((socket) => socket.disconnect());
      set(initialSockets);
    },
  })),
);
