import type { CommunitySummaries } from '@apis/community';
import type { Sockets } from '@stores/socketStore';

import { SOCKET_URL } from '@constants/url';
import { useSocketStore } from '@stores/socketStore';
import React, { useEffect, useMemo, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';
import { io } from 'socket.io-client';

import { joinChannelsPayload, SOCKET_EVENTS } from '@/socketEvents';

const SocketLayer = () => {
  const firstEffect = useRef(true);
  const sockets = useSocketStore((state) => state.sockets);
  const setSockets = useSocketStore((state) => state.setSockets);
  const communitySummaries = useLoaderData() as CommunitySummaries;
  const communityIds = useMemo(
    () => communitySummaries.map((communitySummary) => communitySummary._id),
    [communitySummaries],
  );

  useEffect(() => {
    const newSockets = communityIds.reduce((acc, communityId) => {
      acc[communityId] =
        sockets[communityId] ?? io(`${SOCKET_URL}/commu-${communityId}`);
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

  return <></>;
};

export default SocketLayer;
