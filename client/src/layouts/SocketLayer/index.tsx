import type { ReceiveChatHandler } from '@/socketEvents';
import type { CommunitySummaries } from '@apis/community';
import type { Sockets } from '@stores/socketStore';

import { SOCKET_URL } from '@constants/url';
import { useSetChatsQuery } from '@hooks/chat';
import { useRootStore } from '@stores/rootStore';
import { useSocketStore } from '@stores/socketStore';
import { isScrollTouchedBottom } from '@utils/scrollValues';
import React, { useEffect, useMemo, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';
import { io } from 'socket.io-client';

import { joinChannelsPayload, SOCKET_EVENTS } from '@/socketEvents';

const SocketLayer = () => {
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

  const { addChatsQueryData } = useSetChatsQuery();

  useEffect(() => {
    const newSockets = communityIds.reduce((acc, communityId) => {
      acc[communityId] =
        sockets[communityId] ?? io(`${SOCKET_URL}/socket/commu-${communityId}`);
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
      addChatsQueryData({ id, content, channelId, senderId, createdAt });

      if (chatScrollbar && isScrollTouchedBottom(chatScrollbar, 50)) {
        setTimeout(() => {
          chatScrollbar?.scrollToBottom();
        });
      }
    };

    // 이벤트 on
    socketArr.forEach((socket) => {
      socket.on(SOCKET_EVENTS.RECEIVE_CHAT, handleReceiveChat);
    });

    // 이벤트 off
    return () => {
      socketArr.forEach((socket) => {
        socket.off(SOCKET_EVENTS.RECEIVE_CHAT);
      });
    };
  }, [sockets, chatScrollbar]);

  return <></>;
};

export default SocketLayer;