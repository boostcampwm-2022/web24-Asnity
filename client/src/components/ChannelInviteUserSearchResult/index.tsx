import type { User, UserUID } from '@apis/user';
import type { UsersMap } from '@hooks/user';
import type { MouseEventHandler, FC } from 'react';

import UserItem from '@components/UserItem';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import { UserPlusIcon } from '@heroicons/react/20/solid';
import {
  useInvalidateChannelQuery,
  useInviteChannelMutation,
} from '@hooks/channel';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast } from 'react-toastify';

interface Props {
  communityUsers: User[];
  channelUsersMap: UsersMap;
  channelId: string;
  communityId: string;
}

const ChannelInviteUserSearchResult: FC<Props> = ({
  communityUsers,
  channelUsersMap,
  channelId,
  communityId,
}) => {
  const invalidateChannelQuery = useInvalidateChannelQuery(channelId);
  const inviteChannelMutation = useInviteChannelMutation({
    onSuccess: () => {
      invalidateChannelQuery().finally(() => {
        toast.success('채널로 초대 성공!');
      });
    },
    onError: (error) => defaultErrorHandler(error),
  });

  const handleChannelInviteButtonClick =
    (userId: UserUID): MouseEventHandler<HTMLButtonElement> =>
      /* eslint-disable */
      (e) => {
        inviteChannelMutation.mutate({
          channelId,
          communityId,
          userIds: [userId],
        });
      };

  if (!communityUsers.length) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        검색 결과가 없습니다.
      </div>
    );
  }


  return (
    <Scrollbars>
      <ul>
        {communityUsers.map((user) => {
          /** 이미 채널에 포함된 사용자라면, true */
          const disabled = !!channelUsersMap[user._id];

          return (
            <UserItem
              key={user._id}
              user={user}
              right={
                <div className="flex items-center">
                  <button
                    type="button"
                    className="p-2 rounded-full border border-line active:bg-indigo active:fill-offWhite disabled:bg-offWhite disabled:fill-error-light disabled:cursor-not-allowed"
                    onClick={handleChannelInviteButtonClick(user._id)}
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

export default ChannelInviteUserSearchResult;
