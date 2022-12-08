import type { FC } from 'react';

import Button from '@components/Button';
import ChannelInviteUserSearchResult from '@components/ChannelInviteUserSearchResult';
import ErrorMessage from '@components/ErrorMessage';
import SearchInput from '@components/SearchInput';
import { useCommunityUsersQuery } from '@hooks/user';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

interface UserSearchInput {
  filter: string;
}

interface Props {
  channelId: string;
}
/**
 * 채널 초대 모달 컨텐츠 영역을 나타내는 컴포넌트입니다.
 */
const ChannelInviteBox: FC<Props> = ({ channelId }) => {
  const params = useParams();
  const communityId = params.communityId as string;
  const { register, handleSubmit } = useForm<UserSearchInput>();

  const [submittedFilter, setSubmittedFilter] = useState('');
  const { communityUsersQuery } = useCommunityUsersQuery(
    communityId,
    submittedFilter,
    {
      enabled: !!submittedFilter,
    },
  );
  const handleSubmitUserSearchForm = (data: UserSearchInput) => {
    if (data.filter.trim()) {
      setSubmittedFilter(data.filter);
    }
  };

  return (
    <div className="bg-offWhite min-w-[500px] w-[50vw] h-[70vh]">
      <div className="flex flex-col h-full pb-[20px]">
        <div className="w-full p-8">
          <form
            onSubmit={handleSubmit(handleSubmitUserSearchForm)}
            className="flex gap-2 items-center"
          >
            <SearchInput
              {...register('filter')}
              placeholder="닉네임이나 이메일로 검색하기"
              className="flex-1"
            />
            <Button color="dark" size="sm">
              검색
            </Button>
          </form>
        </div>
        <div className="w-full h-full flex justify-center items-center">
          {/* 캐시에 데이터가 있어도 데이터를 보여주지 않고 검색을 해야지만 검색 결과를 보여줘야 함*/}
          {!communityUsersQuery.isFetchedAfterMount ? (
            <div>검색어를 입력해주세요</div>
          ) : communityUsersQuery.isLoading ? (
            <div>로딩중...</div>
          ) : communityUsersQuery.error ? (
            <ErrorMessage size="lg">에러가 발생했습니다.</ErrorMessage>
          ) : (
            <ChannelInviteUserSearchResult
              users={communityUsersQuery.data}
              communityId={communityId}
              channelId={channelId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelInviteBox;
