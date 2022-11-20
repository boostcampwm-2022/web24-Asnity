import axios from 'axios';

const updateFollowing = (userId: string) =>
  axios.post(`/api/user/following/${userId}`).then((res) => res.data);

export default updateFollowing;
