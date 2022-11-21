import Avatar, { AvatarProps } from '@components/Avatar';
import React from 'react';

const CommunityAvatar: React.FC<AvatarProps> = ({
  variant = 'rectangle',
  size = 'medium',
  name,
  url,
}) => {
  return <Avatar variant={variant} size={size} name={name} url={url} />;
};

export default CommunityAvatar;
