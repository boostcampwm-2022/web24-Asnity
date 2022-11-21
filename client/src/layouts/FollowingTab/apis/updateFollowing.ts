import { API_URL } from '@constants/url';
import axios from 'axios';

const BASE_URL = `${API_URL}/api`;

const updateFollowing = (userId: string) =>
  axios.post(`${BASE_URL}/user/following/${userId}`).then((res) => res.data);

export default updateFollowing;
