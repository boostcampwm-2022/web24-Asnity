export const createChannelData = {
  requestForm: (communityId) => {
    return {
      communityId: communityId,
      name: 'asnity channel',
      isPrivate: true,
      type: 'Channel',
      description: 'test',
    };
  },
  responseForm: {
    statusCode: 200,
    result: {
      _id: expect.any(String),
      name: 'asnity channel',
      communityId: expect.any(String),
      managerId: expect.any(String),
      description: 'test',
      type: 'Channel',
      isPrivate: true,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  },
};

export const getChannelInfoData = {
  responseForm: (channel) => {
    return {
      statusCode: 200,
      result: {
        _id: channel._id.toString(),
        name: channel.name,
        communityId: channel.communityId,
        managerId: channel.managerId,
        description: channel.description,
        type: channel.type,
        isPrivate: channel.isPrivate,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        users: expect.any(Array),
      },
    };
  },
};

export const inviteChannelData = {
  requestForm: (communityId, userId) => {
    return {
      community_id: communityId,
      users: [userId],
    };
  },
  responseForm: (channel, user1Id, user2Id) => {
    return {
      statusCode: 200,
      result: {
        _id: channel._id.toString(),
        name: channel.name,
        communityId: channel.communityId,
        managerId: channel.managerId,
        description: channel.description,
        type: channel.type,
        isPrivate: channel.isPrivate,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        existUnreadChat: expect.any(Boolean),
        users: [user1Id.toString(), user2Id.toString()],
      },
    };
  },
};

export const joinChannelData = {
  responseForm: (channel, user1Id, user2Id) => {
    return {
      statusCode: 200,
      result: {
        _id: channel._id.toString(),
        name: channel.name,
        managerId: channel.managerId,
        communityId: channel.communityId,
        description: channel.description,
        type: channel.type,
        isPrivate: channel.isPrivate,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        lastRead: false,
        users: [user1Id.toString(), user2Id.toString()],
      },
    };
  },
};

export const modifyChannelData = {
  requestForm: {
    description: 'modified',
    isPrivate: 'false',
  },
};
