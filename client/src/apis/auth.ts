import { API_URL } from '@constants/url';
import axios from 'axios';

export const getMyInfo = () =>
  axios.get(`${API_URL}/api/user/auth/me`).then((res) => res.data);
