import endPoint from '@constants/endPoint';
import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { communities } from '../data/communities';
import { communityUsers, users } from '../data/users';
import {
  createErrorContext,
  createSuccessContext,
} from '../utils/createContext';
import { colorLog } from '../utils/logging';

const getCommunitiesEndPoint = API_URL + endPoint.getCommunities();
const GetCommunities = rest.get(getCommunitiesEndPoint, (req, res, ctx) => {
  const ERROR = false;

  const errorResponse = res(...createErrorContext(ctx));

  const successResponse = res(
    ...createSuccessContext(ctx, 200, 500, { communities }),
  );

  return ERROR ? errorResponse : successResponse;
});

// 커뮤니티 생성
const createCommunityEndPoint = API_URL + endPoint.createCommunity();
const CreateCommunity = rest.post(
  createCommunityEndPoint,
  async (req, res, ctx) => {
    const ERROR = false;
    const { name, description } = await req.json();

    const newCommunity = {
      name,
      managerId: '6379beb15d4f08bbe0c940e9',
      description,
      profileUrl: '',
      createdAt: '2022-11-21T10:07:14.390Z',
      updatedAt: '2022-11-21T10:07:14.390Z',
      channels: [],
      users: ['6379beb15d4f08bbe0c940e9'],
      _id: crypto.randomUUID(),
      __v: 0,
    };

    const successResponse = res(
      ...createSuccessContext(ctx, 201, 500, newCommunity),
    );

    const errorResponse = res(...createErrorContext(ctx));

    if (!ERROR) {
      // eslint-disable-next-line no-shadow
      const { name, _id, managerId, profileUrl, description } = newCommunity;

      communities.push({
        name,
        _id,
        managerId,
        profileUrl,
        description,
        channels: [],
      });
    }

    return ERROR ? errorResponse : successResponse;
  },
);

const LeaveCommunityEndPoint = endPoint.leaveCommunity(':communityId');
const LeaveCommunity = rest.delete(LeaveCommunityEndPoint, (req, res, ctx) => {
  const { communityId } = req.params;

  const ERROR = false;
  const successDelay = 500;

  const successResponse = res(
    ...createSuccessContext(ctx, 201, successDelay, {
      message: '커뮤니티 퇴장 성공~',
    }),
  );

  const errorResponse = res(...createErrorContext(ctx));

  if (!ERROR) {
    setTimeout(() => {
      colorLog(`커뮤니티 ID ${communityId}에서 퇴장하였습니다.`);
      const targetIdx = communities.findIndex(({ _id }) => _id === communityId);

      communities.splice(targetIdx, 1);
    }, successDelay);
  }

  return ERROR ? errorResponse : successResponse;
});

const inviteCommunityEndPoint =
  API_URL + endPoint.inviteCommunity(':communityId');
const InviteCommunity = rest.post(
  inviteCommunityEndPoint,
  async (req, res, ctx) => {
    const { users: userIds } = await req.json();

    const ERROR = false;
    const successDelay = 500;

    const successResponse = res(
      ...createSuccessContext(ctx, 201, successDelay, {
        message: '커뮤니티 초대 성공~',
      }),
    );

    const errorResponse = res(...createErrorContext(ctx));

    if (!ERROR) {
      setTimeout(() => {
        communityUsers.push(users.find(({ _id }) => _id === userIds[0]));
      }, successDelay);
    }

    return ERROR ? errorResponse : successResponse;
  },
);

export default [
  GetCommunities,
  CreateCommunity,
  LeaveCommunity,
  InviteCommunity,
];
