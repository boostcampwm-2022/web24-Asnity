import type { FC } from 'react';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigateLink {
  name: string;
  url: string;
}

interface Props {
  title?: string;
  message?: string;
  navigateLinks?: NavigateLink[];
}

const initialDisplayTitle = 'ERROR';
const initialDisplayMessage = '알 수 없는 에러가 발생했습니다.';
const initialDisplayNavigateLinks = [
  {
    name: '홈으로 되돌아가기',
    url: '/',
  },
];

const Error: FC<Props> = ({
  title = initialDisplayTitle,
  message = initialDisplayMessage,
  navigateLinks = initialDisplayNavigateLinks,
}) => {
  const location = useLocation();
  const locationState = location?.state;

  let displayTitle = title;
  let displayMessage = message;
  let displayNavigateLinks = navigateLinks;

  if (locationState) {
    const {
      title: _title,
      message: _message,
      navigateLinks: _navigateLinks,
    } = locationState;

    displayTitle = _title ?? displayTitle;
    displayMessage = _message ?? displayMessage;
    displayNavigateLinks = _navigateLinks ?? displayNavigateLinks;
  }

  return (
    <main className="wrapper flex flex-1 bg-inputBackground">
      <div className="flex flex-col min-w-[720px] w-full h-[80vh] justify-center items-center pt-[100px]">
        <div>
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-4">
              <h2 className="font-bold text-[60px] tracking-tighter">
                {displayTitle}
              </h2>
              <div className="text-[30px] text-label">{displayMessage}</div>
            </div>
            <div className="flex gap-2">
              {displayNavigateLinks.map((navigateLink, idx) => (
                <Link
                  key={idx}
                  to={navigateLink.url}
                  className="block underline bg-offWhite rounded-lg p-1 hover:text-secondary"
                >
                  <div className="font-bold">{navigateLink.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Error;
