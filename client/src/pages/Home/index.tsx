import Button from '@components/Button';
import ErrorIcon from '@components/ErrorIcon';
import ErrorMessage from '@components/ErrorMessage';
import FullScreenSpinner from '@components/FullScreenSpinner';
import CommonModal from '@components/Modals/CommonModal';
import ContextMenuModal from '@components/Modals/ContextMenuModal';
import { useUpdateLastReadAndFetchCommunitiesIntervalEffect } from '@hooks/combine';
import { useCommunitiesQuery } from '@hooks/community';
import Gnb from '@layouts/Gnb';
import Sidebar from '@layouts/Sidebar';
import Sockets from '@layouts/SocketLayer';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
  useUpdateLastReadAndFetchCommunitiesIntervalEffect(1000 * 10);
  const communitiesQuery = useCommunitiesQuery();

  if (communitiesQuery.isError) {
    return (
      <div className="flex flex-col w-screen h-screen items-center justify-center">
        <ErrorIcon />
        <ErrorMessage size="lg" className="mb-3">
          커뮤니티 목록을 불러오는 중, 오류가 발생했습니다. 새로고침을 해주세요.
        </ErrorMessage>
        <Button
          size="md"
          color="error"
          onClick={() => window.location.reload()}
          type="button"
        >
          새로고침
        </Button>
      </div>
    );
  }

  if (communitiesQuery.isLoading) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="wrapper flex flex-1">
      <Sockets />
      <Gnb />
      <Sidebar />
      <Outlet />
      <ContextMenuModal />
      <CommonModal />
    </div>
  );
};

export default Home;
