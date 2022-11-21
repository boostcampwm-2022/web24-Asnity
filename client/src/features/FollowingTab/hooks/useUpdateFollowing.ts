import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetUsersReponse, User } from 'shared/lib/user';

import updateFollowing from '../apis/updateFollowing';

const useUpdateFollowing = (userId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(() => updateFollowing(userId), {
    onMutate: async (deleted: User) => {
      await queryClient.cancelQueries(['followings']);
      const previousFollowings = queryClient.getQueryData<GetUsersReponse>([
        'followings',
      ]);

      if (previousFollowings) {
        const { users } = previousFollowings.result;

        queryClient.setQueryData<GetUsersReponse>(['followings'], {
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
        queryClient.setQueryData<GetUsersReponse>(
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
