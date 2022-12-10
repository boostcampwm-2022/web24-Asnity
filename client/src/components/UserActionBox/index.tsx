import type { User } from '@apis/user';
import type { FC } from 'react';

import Avatar from '@components/Avatar';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import { PencilIcon } from '@heroicons/react/24/solid';
import { useSignOutMutation } from '@hooks/auth';
import { useRootStore } from '@stores/rootStore';
import { useTokenStore } from '@stores/tokenStore';
import { useQueryClient } from '@tanstack/react-query';
import { dateStringToKRLocaleDateString } from '@utils/date';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Props {
  user: User;
}

const UserActionBox: FC<Props> = ({
  user: { status, nickname, profileUrl, createdAt },
}) => {
  const closeCommonModal = useRootStore((state) => state.closeCommonModal);
  const navigate = useNavigate();
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const queryClient = useQueryClient();
  const signOutMutation = useSignOutMutation({
    onSuccess: () => {
      setAccessToken(null);
      closeCommonModal();
      queryClient.clear();
      toast.success('성공적으로 로그아웃하였습니다!');
      navigate('/sign-in', {
        state: { alreadyTriedReissueToken: true },
        replace: true,
      });
    },
    onError: (error) => {
      defaultErrorHandler(error);
    },
  });

  const handleClickSignOutButton = () => {
    signOutMutation.mutate(undefined);
  };

  return (
    <div className="flex flex-col w-[350px] p-[16px] gap-[16px] border-line rounded-2xl">
      <div className="flex justify-between items-center">
        <div>
          <Avatar
            size="md"
            variant="circle"
            name={nickname}
            profileUrl={profileUrl}
            badge
            status={status}
          />
        </div>
        <div>
          <span className="sr-only">내정보 수정하기</span>
          <PencilIcon className="cursor-pointer w-6 h-6 text-placeholder hover:text-body active:text-indigo" />
        </div>
      </div>
      <div className="border border-line rounded-2xl px-[12px] [&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-line [&>div:not(last-child)]:py-[8px]">
        <div className="px-[4px]">
          <strong className="text-s18 font-bold tracking-tight">
            {nickname}
          </strong>
        </div>
        <div className="flex flex-col gap-[4px] text-s12 px-[8px]">
          <div className="uppercase font-bold">asnity 가입 시기:</div>
          <div className="text-body">
            {dateStringToKRLocaleDateString(createdAt)}
          </div>
        </div>
        <div className="text-s16 text-body tracking-tight [&>*]:px-[8px] [&>*]:py-[6px]">
          <div>상태 설정하기</div>
          <button
            type="button"
            className="w-full text-left rounded-2xl hover:bg-inputBackground"
            onClick={handleClickSignOutButton}
            disabled={signOutMutation.isLoading}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserActionBox;
