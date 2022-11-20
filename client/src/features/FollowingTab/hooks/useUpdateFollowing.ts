import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetUserReponse, User } from 'shared/lib/getUserResponse';

import updateFollowing from '../apis/updateFollowing';

const useUpdateFollowing = (userId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(() => updateFollowing(userId), {
    onMutate: async (deleted: User) => {
      await queryClient.cancelQueries(['followings']);
      const previousFollowings = queryClient.getQueryData<GetUserReponse>([
        'followings',
      ]);

      if (previousFollowings) {
        const { users } = previousFollowings.result;

        queryClient.setQueryData<GetUserReponse>(['followings'], {
          ...previousFollowings,
          result: {
            ...previousFollowings.result,
            users: users.filter((user) => user._id !== deleted._id),
          },
        });
      }
      return { previousFollowings };
    },
    onError: (err, variables, context) => {
      if (context?.previousFollowings)
        queryClient.setQueryData<GetUserReponse>(
          ['followings'],
          context.previousFollowings,
        );
    },
    onSettled: () => {
      queryClient.invalidateQueries(['followings']);
    },
  });

  return mutation;
};

export default useUpdateFollowing;
