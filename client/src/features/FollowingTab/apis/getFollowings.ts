import { API_URL } from '@constants/url';
import axios from 'axios';

const BASE_URL = `${API_URL}/api`;

const getFollowings = (query: string) =>
  axios
    .get(`${BASE_URL}/user/followings?query=${query}`)
    .then((res) => res.data);

export default getFollowings;
