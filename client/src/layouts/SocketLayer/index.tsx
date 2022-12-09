import type { ReceiveChatHandler } from '@/socketEvents';
import type { CommunitySummaries } from '@apis/community';
import type { Sockets } from '@stores/socketStore';

import { SOCKET_URL } from '@constants/url';
import { useMyInfoQueryData } from '@hooks/auth';
import { useSetChatsQueryData } from '@hooks/chat';
import { useRootStore } from '@stores/rootStore';
import { useSocketStore } from '@stores/socketStore';
import { useTokenStore } from '@stores/tokenStore';
import { isScrollTouchedBottom } from '@utils/scrollValues';
import React, { useEffect, useMemo, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';
import { io } from 'socket.io-client';

import { joinChannelsPayload, SOCKET_EVENTS } from '@/socketEvents';

const SocketLayer = () => {
  const myInfo = useMyInfoQueryData();
  const accessToken = useTokenStore((state) => state.accessToken);
  const firstEffect = useRef(true);
  const sockets = useSocketStore((state) => state.sockets);
  const setSockets = useSocketStore((state) => state.setSockets);
  const socketArr = useMemo(() => Object.values(sockets), [sockets]);
  const communitySummaries = useLoaderData() as CommunitySummaries;
  const communityIds = useMemo(
    () => communitySummaries.map((communitySummary) => communitySummary._id),
    [communitySummaries],
  );

  const chatScrollbar = useRootStore((state) => state.chatScrollbar);

  const { addChatsQueryData } = useSetChatsQueryData();

  useEffect(() => {
    const opts = {
      auth: { token: `Bearer ${accessToken}` },
    };

    const newSockets = communityIds.reduce((acc, communityId) => {
      acc[communityId] =
        sockets[communityId] ??
        io(`${SOCKET_URL}/socket/commu-${communityId}`, opts);
      return acc;
    }, {} as Sockets);

    setSockets(newSockets);

    if (firstEffect.current) {
      firstEffect.current = false;

      // Record<communityId, channelId[]>
      const channelsMap = communitySummaries.reduce(
        (acc, { _id, channels }) => {
          acc[_id] = channels.map((channel) => channel._id);
          return acc;
        },
        {} as Record<string, string[]>,
      );

      // join channels
      communityIds.forEach((communityId) => {
        newSockets[communityId].emit(
          SOCKET_EVENTS.JOIN_CHANNEL,
          joinChannelsPayload(channelsMap[communityId]),
        );
      });
    }
  }, [communityIds]);

  useEffect(() => {
    if (firstEffect.current) return undefined;

    const handleReceiveChat: ReceiveChatHandler = ({
      id,
      channelId,
      time: createdAt,
      message: content,
      user_id: senderId,
    }) => {
      if (myInfo?._id === senderId) return;

      addChatsQueryData({ id, content, channelId, senderId, createdAt });

      if (chatScrollbar && isScrollTouchedBottom(chatScrollbar, 50)) {
        setTimeout(() => {
          chatScrollbar?.scrollToBottom();
        });
      }
    };

    // const interval = setInterval(() => {
    //   handleReceiveChat({
    //     id: faker.datatype.uuid(),
    //     channelId: 'ce616c1f-6dee-48de-9f93-9c757ce8bfc9',
    //     time: new Date(),
    //     message: '두번째 채널',
    //     user_id: '190eb95f-d854-4082-9847-7d66da0c1238',
    //   });
    //
    //   handleReceiveChat({
    //     id: faker.datatype.uuid(),
    //     channelId: '28f5bb16-e236-4704-8f02-84fbcd89130f',
    //     time: new Date(),
    //     message: '첫번째 채널',
    //     user_id: '1b1260f9-04bf-4e91-9728-c979b0f9e4ed',
    //   });
    // }, 3000);

    // 이벤트 on
    socketArr.forEach((socket) => {
      socket.on(SOCKET_EVENTS.RECEIVE_CHAT, handleReceiveChat);

      socket.on(SOCKET_EVENTS.INVALID_TOKEN, (err) => {
        if ('message' in err) {
          console.error(err.message); // Not Authorized
        }
      });
    });

    // 이벤트 off
    return () => {
      // clearInterval(interval);

      socketArr.forEach((socket) => {
        socket.off(SOCKET_EVENTS.RECEIVE_CHAT);
        socket.off(SOCKET_EVENTS.INVALID_TOKEN);
      });
    };
  }, [sockets, chatScrollbar]);

  return <></>;
};

export default SocketLayer;
