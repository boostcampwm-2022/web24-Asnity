import type { User } from '@apis/user';
import type { UsersMap } from '@hooks/user';
import type { MouseEventHandler, FC } from 'react';

import UserItem from '@components/UserItem';
import { UserPlusIcon } from '@heroicons/react/20/solid';
import { useInvalidateChannelQuery } from '@hooks/channel';
import { useSocketStore } from '@stores/socketStore';
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
  const socket = useSocketStore((state) => state.sockets[communityId]);
  const invalidateChannelQuery = useInvalidateChannelQuery(channelId);

  const handleChannelInviteButtonClick =
    (user: User): MouseEventHandler<HTMLButtonElement> =>
    () => {
      socket.inviteUsersToChannel(
        {
          channel_id: channelId,
          community_id: communityId,
          users: [user._id],
        },
        ({ isSuccess }) => {
          if (isSuccess) {
            invalidateChannelQuery().finally(() => {
              toast.success(
                `${user.nickname}님을 채널에 초대하는데 성공했습니다.`,
              );
            });
            return;
          }
          toast.error(`${user.nickname}님을 채널에 초대하는데 실패했습니다.`);
        },
      );
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
                    onClick={handleChannelInviteButtonClick(user)}
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
