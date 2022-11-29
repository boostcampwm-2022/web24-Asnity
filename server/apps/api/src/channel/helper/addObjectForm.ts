export function getChannelToUserForm(community_id, channel_id) {
  return {
    [`communities.${community_id.toString()}.channels.${channel_id.toString()}`]: new Date(),
  };
}
