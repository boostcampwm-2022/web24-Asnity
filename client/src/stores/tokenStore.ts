import { useStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import createVanillaStore from 'zustand/vanilla';

// NOTE: user는 임시로 넣어둔 상태입니다.
type TokenStore = {
  user: boolean;
  accessToken: null | string;
  setAccessToken: (accessToken: null | string) => void;
};

export const tokenStore = createVanillaStore<TokenStore>()(
  devtools((set) => ({
    user: false,
    accessToken: null,
    setAccessToken: (newAccessToken) =>
      set(() => ({ accessToken: newAccessToken })),
  })),
);

export const useTokenStore = <T>(selector: (state: TokenStore) => T) =>
  useStore(tokenStore, selector);
