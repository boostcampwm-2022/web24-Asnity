import type { FC } from 'react';

import React from 'react';

interface Props {
  userId: string;
}

const DirectMessageUserItem: FC<Props> = () => {
  return <div>사용자가 존재하지 않습니다</div>;
};

export default DirectMessageUserItem;
