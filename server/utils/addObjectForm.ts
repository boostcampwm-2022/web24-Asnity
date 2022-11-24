export function addChannelToUserForm(communityId, channelId) {
  const newChannel = {};
  newChannel[`communities.${communityId.toString()}.channels.${channelId.toString()}`] = new Date();

  return newChannel;
}
