import type { Socket } from 'socket.io-client';

import store from 'zustand';
import { devtools } from 'zustand/middleware';

export type Sockets = Record<string, Socket>;

export type SocketStore = {
  sockets: Sockets;
  setSockets: (sockets: Sockets) => void;
};

export const useSocketStore = store<SocketStore>()(
  devtools((set) => ({
    sockets: {},
    setSockets: (sockets) => set({ sockets }),
  })),
);
