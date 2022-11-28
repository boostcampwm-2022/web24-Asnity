import type { User } from '@apis/user';
import type { FC } from 'react';

import SearchInput from '@components/SearchInput';
import useUsersQuery from '@hooks/useUsersQuery';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/Button';

interface UserSearchInput {
  filter: string;
}

interface Props {
  Variant: FC<{ users?: User[]; isLoading: boolean; error: unknown }>;
}

const UserSearch: React.FC<Props> = ({ Variant }) => {
  const { register, handleSubmit } = useForm<UserSearchInput>();

  const [submittedFilter, setSubmittedFilter] = useState('');
  const usersQuery = useUsersQuery(submittedFilter, {
    enabled: !!submittedFilter,
  });

  const handleSubmitUserSearchForm = (data: UserSearchInput) => {
    setSubmittedFilter(data.filter);
  };

  return (
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
      <Variant
        users={usersQuery?.data}
        isLoading={usersQuery.isFetching}
        error={usersQuery.error}
      />
    </div>
  );
};

export default UserSearch;
