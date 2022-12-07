export function getChannelToUserForm(community_id: string, channel_id: string) {
  return {
    [`communities.${community_id.toString()}.channels.${channel_id.toString()}`]: new Date(),
  };
}
