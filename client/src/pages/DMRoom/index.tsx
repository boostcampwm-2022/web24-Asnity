import React from 'react';
import { useParams } from 'react-router-dom';

const DMRoom = () => {
  const { roomId } = useParams();

  return (
    <>
      <header className="flex items-center pl-[55px] w-full h-header border-b border-line text-indigo font-bold text-[24px]">
        @{roomId}
      </header>
    </>
  );
};

export default DMRoom;
