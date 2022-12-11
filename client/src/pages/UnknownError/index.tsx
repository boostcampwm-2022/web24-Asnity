import type { FC } from 'react';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Fallback {
  name: string;
  url: string;
}

interface Props {
  title?: string;
  summary?: string;
  fallbacks?: Fallback[];
}

const initialDisplayTitle = 'ERROR';
const initialDisplaySummary = '알 수 없는 에러가 발생했습니다.';
const initialDisplayFallbacks = [
  {
    name: '홈으로 되돌아가기',
    url: '/',
  },
];

const UnknownError: FC<Props> = ({
  title = initialDisplayTitle,
  summary = initialDisplaySummary,
  fallbacks = initialDisplayFallbacks,
}) => {
  const location = useLocation();
  const locationState = location?.state;

  let displayTitle = title;
  let displaySummary = summary;
  let displayFallbacks = fallbacks;

  if (locationState) {
    const {
      title: _title,
      summary: _summary,
      fallbacks: _fallbacks,
    } = locationState;

    displayTitle = _title ?? displayTitle;
    displaySummary = _summary ?? displaySummary;
    displayFallbacks = _fallbacks ?? displayFallbacks;
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
              <div className="text-[30px] text-label">{displaySummary}</div>
            </div>
            <div className="flex gap-2">
              {displayFallbacks.map((fallback, idx) => (
                <Link
                  key={idx}
                  to={fallback.url}
                  className="block underline bg-offWhite rounded-lg p-1 hover:text-secondary"
                >
                  <div className="font-bold">{fallback.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UnknownError;
