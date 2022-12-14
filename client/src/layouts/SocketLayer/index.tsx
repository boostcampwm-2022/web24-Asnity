import type {
  ReceiveNewChatListener,
  ReceiveEditedChatListener,
  InvitedToChannelListener,
  ReceiveRemovedChatListener,
} from '@sockets/ClientIOTypes';
import type { Sockets } from '@stores/socketStore';

import REGEX from '@constants/regex';
import { useMyInfoQueryData } from '@hooks/auth';
import { useSetChannelQueryData } from '@hooks/channel';
import { useSetChatsQueryData } from '@hooks/chat';
import { useCommunitiesQuery } from '@hooks/community';
import ClientIO from '@sockets/ClientIO';
import { SOCKET_EVENTS } from '@sockets/ClientIOTypes';
import { useRootStore } from '@stores/rootStore';
import { useSocketStore } from '@stores/socketStore';
import { useTokenStore } from '@stores/tokenStore';
import { isScrollTouchedBottom } from '@utils/scrollValues';
import React, { useEffect, useMemo, useRef } from 'react';

const SocketLayer = () => {
  const myInfo = useMyInfoQueryData();
  const accessToken = useTokenStore((state) => state.accessToken);
  const firstEffect = useRef(true);
  const sockets = useSocketStore((state) => state.sockets);
  const setSockets = useSocketStore((state) => state.setSockets);
  const socketArr = useMemo(() => Object.values(sockets), [sockets]);
  const communitySummariesQuery = useCommunitiesQuery();
  const communitySummaries = communitySummariesQuery.data || [];
  const communityIds = useMemo(
    () => communitySummaries.map((communitySummary) => communitySummary._id),
    [communitySummaries],
  );
  const channelsMap = communitySummaries.reduce((acc, { _id, channels }) => {
    acc[_id] = channels.map((channel) => channel._id);
    return acc;
  }, {} as Record<string, string[]>);

  const chatScrollbar = useRootStore((state) => state.chatScrollbar);

  const { addChannelQueryData, updateExistUnreadChatInChannelQueryData } =
    useSetChannelQueryData();
  const { addChatsQueryData, updateChatQueryData, removeChatQueryData } =
    useSetChatsQueryData();

  useEffect(() => {
    if (!accessToken) return;

    /** 소켓 namespace 연결 */
    const newSockets = communityIds.reduce((acc, communityId) => {
      acc[communityId] =
        sockets[communityId] ??
        new ClientIO({
          communityId,
          opts: ClientIO.createOpts({ token: accessToken }),
        });
      return acc;
    }, {} as Sockets);

    // 이전 상태와 비교해서 communityIds 개수가 다를 때만 소켓 상태 업데이트
    if (Object.keys(sockets).length !== Object.keys(newSockets).length) {
      setSockets(newSockets);
    }

    // join channels
    firstEffect.current = false;
    communityIds.forEach((communityId) => {
      newSockets[communityId]?.joinChannels(channelsMap[communityId]);
    });
  }, [communitySummaries]);

  useEffect(() => {
    if (firstEffect.current) return undefined;

    const handleReceiveNewChat: ReceiveNewChatListener = ({
      id,
      channelId,
      createdAt,
      content,
      senderId,
      communityId,
    }) => {
      if (myInfo?._id === senderId) return;

      // chatInfinityQueryData 마지막 페이지에 삽입
      addChatsQueryData({
        id,
        content,
        channelId,
        senderId,
        createdAt,
      });

      // 스크롤바의 높이를 자동으로 조절
      if (chatScrollbar && isScrollTouchedBottom(chatScrollbar, 50)) {
        setTimeout(() => {
          chatScrollbar?.scrollToBottom();
        });
      }

      const groups = window.location.pathname.match(REGEX.CHANNEL)?.groups as {
        communityId?: string;
        roomId?: string;
      };

      if (channelId !== groups?.roomId)
        updateExistUnreadChatInChannelQueryData(communityId, channelId, true);
    };

    const handleReceiveEditedChat: ReceiveEditedChatListener = (payload) => {
      updateChatQueryData({
        updatedChat: payload,
        channelId: payload.channelId,
      });
    };

    const handleReceiveRemovedChat: ReceiveRemovedChatListener = (payload) => {
      removeChatQueryData(payload);
    };

    const handleInvitedToChannel: InvitedToChannelListener = (payload) => {
      addChannelQueryData(payload.communityId, payload);
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
      socket.on(SOCKET_EVENTS.RECEIVE_CHAT, handleReceiveNewChat);
      socket.on(SOCKET_EVENTS.RECEIVE_EDIT_CHAT, handleReceiveEditedChat);
      socket.on(SOCKET_EVENTS.INVITED_TO_CHANNEL, handleInvitedToChannel);
      socket.on(SOCKET_EVENTS.RECEIVE_REMOVE_CHAT, handleReceiveRemovedChat);
      socket.on(SOCKET_EVENTS.INVALID_TOKEN, (err) => {
        if ('message' in err) {
          console.error(err.message); // Not Authorized
          return;
        }
        console.error('Socket Error');
      });
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
