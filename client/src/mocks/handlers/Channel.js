import endPoint from '@constants/endPoint';
import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { communities } from '../data/communities';
import { me, users } from '../data/users';
import {
  createErrorContext,
  createSuccessContext,
} from '../utils/createContext';

const getChannelEndPoint = API_URL + endPoint.getChannel(':channelId');
const GetChannel = rest.get(getChannelEndPoint, (req, res, ctx) => {
  const { channelId } = req.params;
  const ERROR = false;

  let targetChannel;

  communities.some(({ channels: _channels }) => {
    targetChannel = _channels.find(({ _id }) => _id === channelId);

    return !!targetChannel;
  });

  if (!targetChannel) targetChannel = communities[0].channels[0];

  const errorResponse = res(...createErrorContext(ctx));
  const successResponse = res(
    ...createSuccessContext(ctx, 200, 500, {
      ...targetChannel,
    }),
  );

  return ERROR ? errorResponse : successResponse;
});

const createChannelEndPoint = API_URL + endPoint.createChannel();
const CreateChannel = rest.post(
  createChannelEndPoint,
  async (req, res, ctx) => {
    const { communityId, name, isPrivate, description, profileUrl, type } =
      await req.json();

    const ERROR = false;

    const newChannel = {
      _id: crypto.randomUUID(),
      managerId: me._id,
      name,
      isPrivate,
      profileUrl,
      description,
      existUnreadChat: false,
      type,
      createdAt: new Date().toISOString(),
      users: [me._id],
    };

    const errorResponse = res(...createErrorContext(ctx));
    const successResponse = res(
      ...createSuccessContext(ctx, 200, 500, newChannel),
    );

    const targetCommunity = communities.find(
      (community) => community._id === communityId,
    );

    targetCommunity.channels.push(newChannel);

    return ERROR ? errorResponse : successResponse;
  },
);

const leaveChannelEndPoint = API_URL + endPoint.leaveChannel(':channelId');
const LeaveChannel = rest.delete(leaveChannelEndPoint, (req, res, ctx) => {
  const ERROR = false;

  const errorResponse = res(...createErrorContext(ctx));
  const successRespose = res(
    ...createSuccessContext(ctx, 200, 500, {
      statusCode: 200,
      result: {
        message: '채널 퇴장 성공!',
      },
    }),
  );

  return ERROR ? errorResponse : successRespose;
});

const inviteChannelEndPoint = API_URL + endPoint.inviteChannel(':channelId');
const InviteChannel = rest.post(
  inviteChannelEndPoint,
  async (req, res, ctx) => {
    const { channelId } = req.params;
    /* eslint-disable camelcase */
    const { community_id, userIds } = await req.json();

    const ERROR = false;

    communities
      .find((community) => community._id === community_id)
      .channels.find((channel) => channel._id === channelId)
      .users.push(users.find((user) => user._id === userIds[0]));

    const errorResponse = res(...createErrorContext(ctx));
    const successRespose = res(
      ...createSuccessContext(ctx, 200, 500, {
        statusCode: 200,
        result: {
          message: '채널 초대 성공!',
        },
      }),
    );

    return ERROR ? errorResponse : successRespose;
  },
);

const updateLastReadEndPoint = API_URL + endPoint.updateLastRead(':channelId');
const UpdateLastRead = rest.patch(updateLastReadEndPoint, (req, res, ctx) => {
  const ERROR = false;

  const errorResponse = res(...createErrorContext(ctx));
  const successResponse = res(
    ...createSuccessContext(ctx, 200, 500, {
      statusCode: 200,
      result: {
        message: 'Last Read 업데이트 성공!',
      },
    }),
  );

  return ERROR ? errorResponse : successResponse;
});

export default [
  GetChannel,
  CreateChannel,
  LeaveChannel,
  InviteChannel,
  UpdateLastRead,
];
