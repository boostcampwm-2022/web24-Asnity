import type { JoinedChannel } from '@apis/channel';
import type { User } from '@apis/user';
import type { FC } from 'react';

import Avatar from '@components/Avatar';
import {
  CalendarDaysIcon,
  LinkIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';
import { dateStringToKRLocaleDateString } from '@utils/date';
import cn from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

export interface Props {
  channel: JoinedChannel;
  manager: User;
}

const ChannelCard: FC<Props> = ({ channel, manager }) => {
  const { isPrivate, _id, name, description, createdAt } = channel;
  const iconContainerClassnames = cn({
    'bg-label': !isPrivate,
    'bg-indigo': isPrivate,
  });

  return (
    <li className="flex w-[900px] h-[200px] rounded-2xl overflow-hidden shadow hover:translate-x-5 transition-transform">
      <div
        className={`flex flex-col justify-center items-center w-[200px] h-full ${iconContainerClassnames}`}
      >
        <Link
          to={`channels/${_id}`}
          className="h-full w-full flex justify-center items-center [&:hover>svg]:scale-150 "
        >
          {isPrivate ? (
            <LockClosedIcon className="w-16 h-16 fill-offWhite transition-transform" />
          ) : (
            <LinkIcon className="w-16 h-16 fill-offWhite transition-transform" />
          )}
        </Link>
      </div>

      <div className="px-4 py-2 w-[80%] break-all bg-offWhite-dark">
        <div className="text-s22 font-bold mb-2 text-indigo">{name}</div>
        <div className="text-s16 text-body mb-2">{description}</div>
        <div className="flex gap-1 items-center py-2">
          <Avatar
            size="sm"
            name={manager.nickname}
            profileUrl={manager.profileUrl}
            className="scale-[90%] -translate-x-1"
          />
          <span className="text-titleActive">{manager.nickname} (관리자)</span>
        </div>
        <div className="flex gap-1 items-center mt-2 text-s14">
          <div>
            <span className="sr-only">생성 날짜</span>
            <CalendarDaysIcon className="w-6 h-6" />
          </div>
          <div>
            {dateStringToKRLocaleDateString(createdAt, {
              hour: 'numeric',
              minute: 'numeric',
            })}
            에 만들어진{' '}
            <span className="text-indigo font-bold">
              {isPrivate && '비공개'}
            </span>
            채널입니다.
          </div>
        </div>
      </div>
    </li>
  );
};

export default ChannelCard;
