import Avatar, { AvatarProps } from '@components/Avatar';
import React from 'react';

const CommunityAvatar: React.FC<Pick<AvatarProps, 'name' | 'url'>> = ({
  name,
  url,
}) => {
  return <Avatar variant="rectangle" size="medium" name={name} url={url} />;
};

export default CommunityAvatar;
