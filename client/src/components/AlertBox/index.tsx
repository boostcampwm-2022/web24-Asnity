import Button from '@components/Button';
import React from 'react';

interface Props {
  description: string;
  onCancel: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const AlertBox: React.FC<Props> = ({
  onSubmit,
  onCancel,
  description,
  disabled = false,
}) => {
  return (
    <section className="flex flex-col p-[24px] w-[400px] break-all">
      <h3 className="sr-only">한번 더 물어보는 알림 메뉴</h3>
      <header className="mb-[36px] flex-grow">
        <h4 className="text-s18">{description}</h4>
      </header>
      <div className="flex justify-between gap-[24px]">
        <Button
          color="error"
          width="50%"
          onClick={onCancel}
          disabled={disabled}
        >
          취소
        </Button>
        <Button
          color="success"
          width="50%"
          onClick={onSubmit}
          disabled={disabled}
        >
          확인
        </Button>
      </div>
    </section>
  );
};

export default AlertBox;
