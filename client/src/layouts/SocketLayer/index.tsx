import type {
  ReceiveChatHandler,
  InvitedToChannelHandler,
  ReceiveEditChatHandler,
} from '@/socketEvents';
import type { CommunitySummaries } from '@apis/community';
import type { Sockets } from '@stores/socketStore';

import { SOCKET_URL } from '@constants/url';
import { useMyInfoQueryData } from '@hooks/auth';
import { useSetChannelQueryData } from '@hooks/channel';
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

  const { addChannelQueryData, updateLastReadInChannelQueryData } =
    useSetChannelQueryData();
  const { addChatsQueryData, updateChatQueryData } = useSetChatsQueryData();

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

    // TODO: 채팅 받을 때의 명세가 달라질 것 같으니 수정 준비하세요~
    const handleReceiveChat: ReceiveChatHandler = ({
      // communityId,
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

      const groups = window.location.pathname.match(
        /\/communities\/(?<communityId>\w+)\/channels\/(?<roomId>\w+)/u,
      )?.groups as { communityId?: string; roomId?: string };

      if (channelId !== groups?.roomId)
        // 현재 communityId 보내주지 않으므로 첫번째 커뮤니티로 넣어줌
        // TODO: 보내주는 communityId를 updateLastRead의 첫번째 인자로 넘겨야함
        updateLastReadInChannelQueryData(communityIds[0], channelId, true);
    };

    const handleReceiveEditChat: ReceiveEditChatHandler = ({
      updatedChat,
      channelId,
    }) => {
      updateChatQueryData({ updatedChat, channelId });
    };

    const handleInvitedToChannel: InvitedToChannelHandler = ({
      communityId,
      ...joinedChannel
    }) => {
      addChannelQueryData(communityId, joinedChannel);
    };

    // const interval = setInterval(() => {
    // handleReceiveChat({
    //   id: Date.now(),
    //   channelId: 'ce616c1f-6dee-48de-9f93-9c757ce8bfc9',
    //   time: new Date(),
    //   message: '두번째 채널',
    //   user_id: '190eb95f-d854-4082-9847-7d66da0c1238',
    // });
    //
    // handleReceiveChat({
    //   id: Date.now(),
    //   channelId: '28f5bb16-e236-4704-8f02-84fbcd89130f',
    //   time: new Date(),
    //   message: '첫번째 채널',
    //   user_id: '1b1260f9-04bf-4e91-9728-c979b0f9e4ed',
    // });
    // handleReceiveEditChat({
    //   updatedChat: {
    //     id: Math.floor(Math.random() * 5) + 55,
    //     content: Math.random().toString(),
    //     createdAt: '',
    //     deletedAt: '',
    //     type: 'TEXT',
    //     updatedAt: new Date().toISOString(),
    //     senderId: '',
    //     written: undefined,
    //   },
    //   channelId: 'c84ce979-7e14-497a-8384-774318468cf2',
    // });
    // }, 3000);

    // 이벤트 on
    socketArr.forEach((socket) => {
      socket.on(SOCKET_EVENTS.RECEIVE_CHAT, handleReceiveChat);

      socket.on(SOCKET_EVENTS.INVALID_TOKEN, (err) => {
        if ('message' in err) {
          console.error(err.message); // Not Authorized
        }
      });

      socket.on(SOCKET_EVENTS.RECEIVE_EDIT_CHAT, handleReceiveEditChat);
      socket.on(SOCKET_EVENTS.INVITED_TO_CHANNEL, handleInvitedToChannel);
    });

    // 이벤트 off
    return () => {
      // clearInterval(interval);

      socketArr.forEach((socket) => {
        socket.off(SOCKET_EVENTS.RECEIVE_CHAT);
        socket.off(SOCKET_EVENTS.INVALID_TOKEN);
        socket.off(SOCKET_EVENTS.INVITED_TO_CHANNEL);
      });
    };
  }, [sockets, chatScrollbar]);

  return <></>;
};

export default SocketLayer;
