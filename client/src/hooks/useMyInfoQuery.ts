import { getMyInfo } from '@apis/auth';
import { useQuery } from '@tanstack/react-query';
import queryKeyCreator from 'src/queryKeyCreator';

const useMyInfoQuery = () => {
  const query = useQuery(queryKeyCreator.me(), getMyInfo);

  return query;
};

export default useMyInfoQuery;
