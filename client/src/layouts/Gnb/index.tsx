import Avatar from '@components/Avatar';
import GnbItemContainer from '@components/GnbItemContainer';
import { LOGO_IMG_URL } from '@constants/url';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useRootStore } from '@stores/rootStore';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Gnb = () => {
  const { pathname } = useLocation();
  const openCreateCommunityModal = useRootStore(
    (state) => state.openCreateCommunityModal,
  );

  return (
    <div className="flex min-w-[80px] w-[80px] h-full bg-background border-r border-line z-[100px]">
      <div className="flex flex-col justify-start items-center w-full pt-[16px] overflow-auto no-display-scrollbar">
        <GnbItemContainer isActive={pathname === '/dms'}>
          <Link to="/dms">
            <Avatar
              name="Direct Message"
              size="small"
              url={LOGO_IMG_URL}
              variant="rectangle"
            />
          </Link>
        </GnbItemContainer>

        <div className="w-[70%] h-[2px] bg-line mb-[10px]"></div>

        <ul className="w-full">
          <GnbItemContainer>
            <Link to="/dms">
              <Avatar name="Asnity" size="small" variant="rectangle" />
            </Link>
          </GnbItemContainer>
          <GnbItemContainer>
            <Link to="/dms">
              <Avatar name="Asnity" size="small" variant="rectangle" />
            </Link>
          </GnbItemContainer>
        </ul>

        <button type="button" onClick={openCreateCommunityModal}>
          <span className="sr-only">커뮤니티 추가</span>
          <Avatar
            name="커뮤니티 추가"
            size="small"
            variant="circle"
            className="transition-all hover:bg-primary hover:border-primary hover:text-offWhite"
          >
            <PlusIcon className="w-6 h-6" />
          </Avatar>
        </button>
      </div>
    </div>
  );
};

export default Gnb;
