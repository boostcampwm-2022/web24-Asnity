import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="wrapper flex flex-1">
      <div className="flex flex-col min-w-[720px] w-full h-full items-center pt-[100px] bg-inputBackground">
        <div>
          <div className="flex flex-col items-center gap-11">
            <div className="flex flex-col items-center">
              <h1 className="font-bold text-[240px] leading-none text-primary-dark select-none ">
                404
              </h1>
              <h2 className="font-bold text-[60px] tracking-tighter">
                Page Not Found
              </h2>
              <div className="text-[30px] text-label">
                요청하신 페이지를{' '}
                <span className="text-primary-dark font-bold">
                  찾을 수 없습니다.
                </span>
              </div>
              <div className="pt-4 border-t-2 border-line">
                페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다. 입력하신
                주소가 정확한지 다시 한 번 확인하세요.
              </div>
            </div>
            <Link
              to="/"
              className="underline bg-offWhite rounded-lg p-1  hover:text-primary-dark"
            >
              <div className="font-bold">홈으로 되돌아가기</div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
