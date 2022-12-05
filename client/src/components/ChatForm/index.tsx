import type {
  ComponentPropsWithoutRef,
  FC,
  FormEvent,
  FormEventHandler,
  KeyboardEventHandler,
} from 'react';

import { PaperAirplaneIcon, BackspaceIcon } from '@heroicons/react/24/solid';
import useInput from '@hooks/useInput';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

interface Props extends ComponentPropsWithoutRef<'textarea'> {
  editMode?: boolean;
  initialValue?: string;
  handleCancelEdit?: () => void;
  handleSubmitChat?: (chat: string, e: FormEvent) => void;
}

const ChatForm: FC<Props> = ({
  editMode = false,
  initialValue = '',
  handleSubmitChat,
  handleCancelEdit,
  className,
  ...restProps
}) => {
  const { roomId } = useParams();
  const [value, onChange, isDirty, setValue] = useInput(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * 다른 채널로 이동시, value 상태값이 유지되며 채팅 폼이 미리 입력되어 있는 현상을 방지하기 위해
   * 채널 입장마다 value 상태값을 초기화합니다.
   **/
  useEffect(() => {
    setValue('');
  }, [roomId]);

  useEffect(() => {
    if (!textareaRef.current) return undefined;

    const textarea = textareaRef.current;

    const handleChangeInput = () => {
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    textarea.addEventListener('input', handleChangeInput);

    return () => textarea.removeEventListener('input', handleChangeInput);
  }, []);

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!value.trim() || !isDirty) return;

    handleSubmitChat?.(value, e);
  };

  const handleCancelForm = () => {
    handleCancelEdit?.();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitButtonRef.current?.click();
      return;
    }

    if (editMode && e.key === 'Escape') {
      handleCancelForm();
    }
  };

  return (
    <form
      className={`flex flex-col p-2 bg-offWhite relative border border-line text-line focus-within:text-indigo focus-within:border-indigo rounded-2xl 
      [&_button>svg]:fill-line [&:focus-within_.chat-submit-button>svg]:fill-indigo [&_.chat-submit-button:disabled>svg]:fill-line [&:focus-within_.chat-cancel-button>svg]:fill-error ${className}`}
      onSubmit={handleSubmitForm}
    >
      <textarea
        rows={1}
        className={`grow border-0 p-3 w-full resize-none outline-0 border border-placeholder focus:border-indigo rounded-xl p-3`}
        placeholder="내용을 입력해주세요."
        {...restProps}
        onKeyDown={handleKeyDown}
        ref={textareaRef}
        value={value}
        onChange={onChange}
      />
      <div className="relative h-[30px] shrink-0">
        {editMode && (
          <button
            type="button"
            className="chat-cancel-button absolute right-12 h-full [&:hover>svg]:fill-error"
            onClick={handleCancelForm}
          >
            <span className="sr-only">채팅 편집 취소 버튼</span>
            <BackspaceIcon className="w-6 h-6" />
          </button>
        )}

        <button
          className="chat-submit-button absolute right-3 h-full [&:hover>svg]:fill-indigo "
          ref={submitButtonRef}
          disabled={!isDirty}
        >
          <span className="sr-only">채팅 입력 버튼</span>
          <PaperAirplaneIcon className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};

export default ChatForm;