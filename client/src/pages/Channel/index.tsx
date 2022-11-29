import ChannelMetadata from '@components/ChannelMetadata';
import ChatItem from '@components/ChatItem';
import { faker } from '@faker-js/faker';
import { useChannelQuery } from '@hooks/channel';
import { useUserQuery } from '@hooks/user';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useParams } from 'react-router-dom';

const chatList = [
  {
    _id: faker.datatype.uuid(),
    content: faker.lorem.sentences(),
    senderId: faker.datatype.uuid(),
    updatedAt: '',
    createdAt: new Date().toISOString(),
    deletedAt: '',
  },
  {
    _id: faker.datatype.uuid(),
    content: faker.lorem.sentences(),
    senderId: faker.datatype.uuid(),
    updatedAt: 'updatedAt',
    createdAt: new Date().toISOString(),
    deletedAt: '',
  },
  {
    _id: faker.datatype.uuid(),
    content: faker.lorem.sentences(),
    senderId: faker.datatype.uuid(),
    updatedAt: '',
    createdAt: new Date().toISOString(),
    deletedAt: 'deletedAt',
  },
];

const Channel = () => {
  const params = useParams();
  const roomId = params.roomId as string;
  const { channelQuery } = useChannelQuery(roomId);
  const { userQuery } = useUserQuery(channelQuery.data?.managerId as string, {
    enabled: !!channelQuery.data?.managerId,
  });

  if (channelQuery.isLoading) return <div>loading...</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <header className="flex items-center pl-[56px] w-full border-b border-line shrink-0 basis-[90px]">
        <div className="block w-[400px] overflow-ellipsis overflow-hidden whitespace-nowrap text-indigo font-bold text-[24px]">
          {channelQuery.data && `#${channelQuery.data.name}`}
        </div>
      </header>
      <div className="flex h-full">
        <div className="flex-1 min-w-[720px] max-w-[960px] h-full">
          <Scrollbars>
            {channelQuery.data && userQuery.data && (
              <div className="p-8">
                <ChannelMetadata
                  profileUrl={channelQuery.data.profileUrl}
                  channelName={channelQuery.data.name}
                  isPrivate={channelQuery.data.isPrivate}
                  createdAt={channelQuery.data.createdAt}
                  managerName={userQuery.data.nickname}
                />
              </div>
            )}
            <div>
              <ul className="flex flex-col gap-3 [&>*:hover]:bg-background">
                {chatList.map((chat) => (
                  <ChatItem key={chat._id} chat={chat} className="px-8" />
                ))}
              </ul>
            </div>
          </Scrollbars>
        </div>
        <div className="flex w-72 h-full border-l border-line">
          온라인, 오프라인
        </div>
      </div>
    </div>
  );
};

export default Channel;
