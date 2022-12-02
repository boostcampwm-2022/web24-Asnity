import endPoint from '@constants/endPoint';
import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { communities } from '../data/communities';
import { me } from '../data/users';
import {
  createErrorContext,
  createSuccessContext,
} from '../utils/createContext';

const getChannelEndPoint = API_URL + endPoint.getChannel(':channelId');
const GetChannel = rest.get(getChannelEndPoint, (req, res, ctx) => {
  const { channelId } = req.params;
  const ERROR = false;

  let targetChannel;

  communities.forEach(({ channels: _channels }) => {
    targetChannel = _channels.find(({ _id }) => _id === channelId);
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
      lastRead: true,
      type,
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

export default [GetChannel, CreateChannel];
