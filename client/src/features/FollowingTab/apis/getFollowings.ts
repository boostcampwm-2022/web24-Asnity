import axios from 'axios';

const getFollowings = (query: string) =>
  axios.get(`/api/user/followings?query=${query}`).then((res) => res.data);

export default getFollowings;
