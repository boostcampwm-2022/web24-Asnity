import { useStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import createVanillaStore from 'zustand/vanilla';

type TokenStore = {
  accessToken: null | string;
  setAccessToken: (accessToken: null | string) => void;
};

export const tokenStore = createVanillaStore<TokenStore>()(
  devtools((set) => ({
    accessToken: null,
    setAccessToken: (newAccessToken) =>
      set(() => ({ accessToken: newAccessToken })),
  })),
);

export const useTokenStore = <T>(selector: (state: TokenStore) => T) =>
  useStore(tokenStore, selector);
