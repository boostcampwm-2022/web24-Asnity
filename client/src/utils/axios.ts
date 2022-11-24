import { API_URL } from '@constants/url';
import { tokenStore } from '@stores/tokenStore';
import axios from 'axios';

const { getState } = tokenStore;

/**
 * @description
 * ## Asnity api server 전용 Axios instance
 * - `baseURL`은 Asnity server 이다. 따라서 엔드포인트 작성시 `baseURL`이후 부분만 적는다.
 * - Api 요청시 전역 상태에서 관리하는 accessToken을 Authorization header에 삽입하고 보낸다.
 * - accessToken이 없다면 요청 Promise가 Reject된다.
 * - 토큰 만료 응답시 Response interceptors에서 재발급 후 Request 재요청 하는 로직은 추후에 추가할 예정.
 */
export const tokenAxios = axios.create({
  baseURL: API_URL,
});

/**
 * @description
 * ## Asnity api server 전용 Axios instance
 * - `baseURL`은 Asnity server 이다. 따라서 엔드포인트 작성시 `baseURL`이후 부분만 적는다.
 * - accessToken이 필요없는 요청을 보낼 때 사용한다.
 */
export const publicAxios = axios.create({
  baseURL: API_URL,
});

tokenAxios.interceptors.request.use(
  (config) => {
    const { accessToken } = getState();

    console.warn('tokenAxios 사용 확인용 로그. 무시하시면 됩니다.');

    if (!accessToken) {
      console.warn(`accessToken이 없습니다.`);
      return Promise.reject(
        `tokenAxios instance로 요청을 보내기 위해서는 accessToken이 필요합니다.`,
      );
    }

    config.headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
