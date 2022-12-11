import axios from 'axios';

export const requestApiServer = async ({ method, path, accessToken, data }) => {
  if (process.env.NODE_ENV === 'dev') {
    return true;
  }
  const url = 'http://localhost:' + (process.env.NODE_ENV == 'dev' ? 3000 : 3001) + path;
  try {
    const response = await axios({
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data,
      responseType: 'json',
    });
    if (
      response.status >= 300 ||
      response.data?.statusCode > 300 ||
      response.data?.name?.match(/error/i) ||
      response.data?.message?.match(/error/i)
    ) {
      // throw new WsException('API Server 요청 중 에러가 발생했습니다.');
      console.log(data.name ?? data.message ?? 'API Request Error');
      return false;
    }
    return response.data.result ?? true;
  } catch (error) {
    console.log(error);
    // throw new WsException('API Server 요청 중 에러가 발생했습니다.');
    return false;
  }
};
