import type { FC } from 'react';

import Button from '@components/Button';
import CommunityInviteUserSearchResult from '@components/CommunityInviteUserSearchResult';
import ErrorMessage from '@components/ErrorMessage';
import SearchInput from '@components/SearchInput';
import { useUsersQuery } from '@hooks/user';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface UserSearchInput {
  filter: string;
}

interface Props {
  communityId: string;
}
/**
 * 커뮤니티 초대 모달 컨텐츠 영역을 나타내는 컴포넌트입니다.
 */
const CommunityInviteBox: FC<Props> = ({ communityId }) => {
  const { register, handleSubmit } = useForm<UserSearchInput>();

  const [submittedFilter, setSubmittedFilter] = useState('');
  const usersQuery = useUsersQuery(submittedFilter, {
    enabled: !!submittedFilter,
  });

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
          {usersQuery.isLoading && usersQuery.isFetching ? (
            <div>로딩중...</div>
          ) : usersQuery.isLoading ? (
            <div>검색어를 입력해주세요</div>
          ) : usersQuery.error ? (
            <ErrorMessage size="lg">에러가 발생했습니다.</ErrorMessage>
          ) : (
            <CommunityInviteUserSearchResult
              users={usersQuery.data}
              communityId={communityId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityInviteBox;
