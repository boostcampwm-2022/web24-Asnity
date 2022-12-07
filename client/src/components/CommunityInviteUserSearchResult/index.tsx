import type { User, UserUID } from '@apis/user';
import type { MouseEventHandler, FC } from 'react';

import UserItem from '@components/UserItem';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import { UserPlusIcon } from '@heroicons/react/20/solid';
import { useInviteCommunityMutation } from '@hooks/community';
import {
  useCommunityUsersMapQuery,
  useInvalidateCommunityUsersQuery,
} from '@hooks/user';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast } from 'react-toastify';

interface Props {
  users: User[];
  communityId: string;
}

const CommunityInviteUserSearchResult: FC<Props> = ({ users, communityId }) => {
  const communityUsersMap = useCommunityUsersMapQuery(communityId);
  const inviteCommunityMutation = useInviteCommunityMutation();
  const { invalidateCommunityUsersQuery } =
    useInvalidateCommunityUsersQuery(communityId);

  const handleClickCommunityInviteButton =
    (
      _communityId: string,
      userIds: Array<UserUID>,
    ): MouseEventHandler<HTMLButtonElement> =>
    () => {
      if (inviteCommunityMutation.isLoading) return;

      inviteCommunityMutation
        .mutateAsync({ communityId: _communityId, userIds })
        .then(() => {
          invalidateCommunityUsersQuery().finally(() => {
            toast.success('커뮤니티로 초대 성공!');
          });
        })
        .catch((_error) => defaultErrorHandler(_error));
    };

  if (!users.length) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <Scrollbars>
      <ul>
        {users.map((user) => {
          /** 이미 커뮤니티에 포함된 사용자라면, true */
          const disabled = !!communityUsersMap.data?.[user._id];

          return (
            <UserItem
              key={user._id}
              user={user}
              right={
                <div className="flex items-center">
                  <button
                    type="button"
                    className="p-2 rounded-full border border-line active:bg-indigo active:fill-offWhite disabled:bg-offWhite disabled:fill-error-light disabled:cursor-not-allowed"
                    onClick={handleClickCommunityInviteButton(communityId, [
                      user._id,
                    ])}
                    disabled={disabled}
                  >
                    <span className="sr-only">커뮤니티에 초대하기</span>
                    <UserPlusIcon className="w-6 h-6 fill-[inherit] pointer-events-none" />
                  </button>
                </div>
              }
            />
          );
        })}
      </ul>
    </Scrollbars>
  );
};

export default CommunityInviteUserSearchResult;
