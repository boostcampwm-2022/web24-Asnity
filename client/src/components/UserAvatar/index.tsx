import Avatar, { AvatarProps } from '@components/Avatar';
import React from 'react';

const UserAvatar: React.FC<AvatarProps> = ({
  variant = 'circle',
  size = 'small',
  name,
  url,
}) => {
  return <Avatar variant={variant} size={size} name={name} url={url} />;
};

export default UserAvatar;
