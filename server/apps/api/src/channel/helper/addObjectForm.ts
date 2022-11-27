export function getChannelToUserForm(communityId, channelId) {
  return {
    [`communities.${communityId.toString()}.channels.${channelId.toString()}`]: new Date(),
  };
}
