export function addChannelToUserForm(communityId, channelId) {
  return {
    [`communities.${communityId.toString()}.channels.${channelId.toString()}`]: new Date(),
  };
}
