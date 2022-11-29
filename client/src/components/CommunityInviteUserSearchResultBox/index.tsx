import type { User, UserUID } from '@apis/user';
import type { MouseEventHandler } from 'react';

import ErrorMessage from '@components/ErrorMessage';
import UserItem from '@components/UserItem';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import { UserPlusIcon } from '@heroicons/react/20/solid';
import { useInviteCommunityMutation } from '@hooks/community';
import {
  useCommunityUsersQuery,
  useInvalidateCommunityUsersQuery,
} from '@hooks/user';
import { useRootStore } from '@stores/rootStore';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast } from 'react-toastify';

interface Props {
  users?: User[];
  isLoading: boolean;
  error: unknown;
}

const CommunityInviteUserSearchResultBox: React.FC<Props> = ({
  users,
  isLoading,
  error,
}) => {
  const data = useRootStore(
    (state) => state.commonModal.data as { communityId: string },
  );

  const { communityUsersQuery } = useCommunityUsersQuery(data.communityId);
  const inviteCommunityMutation = useInviteCommunityMutation();
  const { invalidateCommunityUsersQuery } = useInvalidateCommunityUsersQuery(
    data.communityId,
  );

  const handleClickCommunityInviteButton =
    (
      communityId: string,
      userIds: Array<UserUID>,
    ): MouseEventHandler<HTMLButtonElement> =>
    () => {
      if (inviteCommunityMutation.isLoading) return;

      inviteCommunityMutation
        .mutateAsync({ communityId, userIds })
        .then(() => {
          invalidateCommunityUsersQuery().finally(() => {
            toast.success('커뮤니티로 초대 성공!');
          });
        })
        .catch((_error) => defaultErrorHandler(_error));
    };

  if (!communityUsersQuery?.data) {
    return <div />;
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        로딩중...
      </div>
    );
  }

  if (!users) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        검색어를 입력하세요
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        검색 결과가 없습니다.
      </div>
    );
  }

  if (error || communityUsersQuery.error) {
    return (
      <ErrorMessage size="lg">
        사용자를 불러오는데 에러가 발생했습니다.
      </ErrorMessage>
    );
  }

  return (
    <Scrollbars>
      <ul>
        {users.map((user) => {
          /** 이미 커뮤니티에 포함된 사용자라면, true */
          const disabled = communityUsersQuery.data.some(
            ({ _id }) => _id === user._id,
          );

          return (
            <UserItem
              key={user._id}
              user={user}
              right={
                <div className="flex items-center">
                  <button
                    type="button"
                    className="p-2 rounded-full border border-line active:bg-indigo active:fill-offWhite disabled:bg-offWhite disabled:fill-error-light disabled:cursor-not-allowed"
                    onClick={handleClickCommunityInviteButton(
                      data.communityId,
                      [user._id],
                    )}
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

export default CommunityInviteUserSearchResultBox;
