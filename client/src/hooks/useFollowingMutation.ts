import type { GetFollowingsResponse, User } from '@apis/user';

import { updateFollowing } from '@apis/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

const useFollowingMutation = (userId: string) => {
  const key = queryKeyCreator.followings();
  const queryClient = useQueryClient();
  const mutation = useMutation(() => updateFollowing(userId), {
    onMutate: async (deleted: User) => {
      await queryClient.cancelQueries(key);

      const previousFollowings =
        queryClient.getQueryData<GetFollowingsResponse>(key);

      if (previousFollowings) {
        queryClient.setQueryData<GetFollowingsResponse>(key, {
          ...previousFollowings,
          result: {
            ...previousFollowings.result,
            followings: previousFollowings.result.followings.filter(
              (following) => following._id !== deleted._id,
            ),
          },
        });
      }
      return { previousFollowings };
    },
    onError: (err, variables, context) => {
      if (context?.previousFollowings)
        queryClient.setQueryData<GetFollowingsResponse>(
          key,
          context.previousFollowings,
        );
    },
    onSettled: () => {
      queryClient.invalidateQueries(key);
    },
  });

  return mutation;
};

export default useFollowingMutation;
