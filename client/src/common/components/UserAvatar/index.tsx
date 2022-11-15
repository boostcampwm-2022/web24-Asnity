import Avatar, { AvatarProps } from '@components/Avatar';
import React from 'react';

const UserAvatar: React.FC<Pick<AvatarProps, 'name' | 'url'>> = ({
  name,
  url,
}) => {
  return <Avatar variant="circle" size="small" name={name} url={url} />;
};

export default UserAvatar;
