import axios from 'axios';
import { WsException } from '@nestjs/websockets';

export const requestApiServer = async ({ path, accessToken, data }) => {
  const apiUrl = 'http://localhost:' + (process.env.NODE_ENV == 'dev' ? 3000 : 3001) + path;
  try {
    const response = await axios({
      method: 'post',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data,
      responseType: 'json',
    });
    if (
      response.status >= 300 ||
      response.data?.name?.match(/error/i) ||
      response.data?.message?.match(/error/i)
    ) {
      // throw new WsException('API Server 요청 중 에러가 발생했습니다.');
      return false;
    }
    return true;
  } catch (error) {
    // throw new WsException('API Server 요청 중 에러가 발생했습니다.');
    return false;
  }
};
