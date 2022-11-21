import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import React from 'react';

// TODO: ComponentPropsWithoutRef<'input'>을 Extends하는 인터페이스로 작성해도 됩니다
// TODO: 그런데 @typescript-eslint/no-empty-interface룰 때문에, 빈 인터페이스는 타입으로 바뀌네요.
// TODO: 마지막으로, 모든 Props에 공통되는 사항인데 해당 컴포넌트의 Props는 네이밍을 XXXProps가 아닌, Props로 줄여서 작성해도 좋을것 같아요.
type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {/* TODO: 이쪽도 아이콘의 의미에 맞는 설명을 넣어주면 좋을 것 같아요. */}
        <MagnifyingGlassIcon className="w-5 h-5 fill-label" />
      </div>
      <input
        type="text"
        id="input-group-1"
        className="bg-inputBackground border border-line text-s16 text-label rounded-2xl w-full pl-10 p-2.5 focus:outline-line focus:bg-offWhite focus:font-bold"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

// TODO: displayName 없애도 데브툴엔 제대로 표기되는거로 확인되었는데, 문제 생기는 부분이 있는걸까요?
SearchInput.displayName = 'SearchInput';

export default SearchInput;
