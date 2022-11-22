import { getMyInfo } from '@apis/auth';
import { useQuery } from '@tanstack/react-query';
import queryKeyCreator from 'src/queryKeyCreator';

const useMyInfoQuery = () => {
  const key = queryKeyCreator.me();
  const query = useQuery(key, getMyInfo);

  return query;
};

export default useMyInfoQuery;
