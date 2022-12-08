import type { FC } from 'react';

import React from 'react';

export interface Props {
  content: string;
}

const ChatContent: FC<Props> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <>
      {lines.map((line, idx) => (
        <p key={idx}>{line.length ? line : <br />}</p>
      ))}
    </>
  );
};

export default ChatContent;
