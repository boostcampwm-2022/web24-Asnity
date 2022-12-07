import axios from 'axios';
import { WsException } from '@nestjs/websockets';

export const requestApiServer = async ({ path, accessToken, data }) => {
  const apiUrl = 'http://localhost:3000' + path;
  try {
    const response = await axios({
      method: 'post', // 통신 방식
      url: apiUrl, // 서버
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }, // 요청 헤더 설정
      data,
      responseType: 'json', // default
    });
    if (
      response.status >= 300 ||
      response.data?.name?.match(/error/i) ||
      response.data?.message?.match(/error/i)
    ) {
      throw new WsException('API Server 요청 중 에러가 발생했습니다.');
    }
  } catch (error) {
    throw new WsException('API Server 요청 중 에러가 발생했습니다.');
  }
};
