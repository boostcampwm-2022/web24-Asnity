import type { CSSProperties } from 'react';

import Button from '@components/Button';
import ErrorMessage from '@components/ErrorMessage';
import Input from '@components/Input';
import SuccessMessage from '@components/SuccessMessage';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import {
  useCommunitiesQuery,
  useCreateCommunityMutation,
} from '@hooks/community';
import { useRootStore } from '@stores/rootStore';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface CreateCommunityFormFields {
  communityName: string;
  communityDescription: string;
}

const createCommunityFormDefaultValue = {
  communityName: '',
  communityDescription: '',
};

const modalContentStyle: CSSProperties = {
  width: 350,
  height: 300,
  borderRadius: 10,
  padding: 20,
  left: '50%',
  top: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
};

const modalOverlayStyle: CSSProperties = {
  background: 'rgba(0, 0, 0, 0.5)',
};

interface Props {}

ReactModal.setAppElement('#root');

const CreateCommunityModal: React.FC<Props> = () => {
  const { isOpen } = useRootStore((state) => state.createCommunityModal);
  const closeCreateCommunityModal = useRootStore(
    (state) => state.closeCreateCommunityModal,
  );
  const navigate = useNavigate();
  const { invalidateCommunitiesQuery } = useCommunitiesQuery();
  const createCommunityMutation = useCreateCommunityMutation({
    onSuccess: ({ _id }) => {
      invalidateCommunitiesQuery()
        .then(() => {
          navigate(`/communities/${_id}`);
        })
        .catch((error) => {
          console.error(error);
          toast.error('커뮤니티는 생성되었지만, 불러오는데 실패했습니다.');
        });

      // eslint-disable-next-line no-use-before-define
      handleCloseModal();
    },
    onError: (error) => {
      defaultErrorHandler(error);
    },
  });

  const { control, handleSubmit, reset } = useForm<CreateCommunityFormFields>({
    mode: 'all',
    defaultValues: createCommunityFormDefaultValue,
  });

  const handleCloseModal = () => {
    if (createCommunityMutation.isLoading) return; // Form 제출 처리중엔 취소할 수 없음.
    closeCreateCommunityModal();
    reset();
  };

  const handleSubmitCreateCommunityForm = (
    fields: CreateCommunityFormFields,
  ) => {
    const { communityName: name, communityDescription: description } = fields;

    createCommunityMutation.mutate({ name, description });
  };

  return (
    <ReactModal
      isOpen={isOpen}
      style={{
        content: modalContentStyle,
        overlay: modalOverlayStyle,
      }}
      onRequestClose={handleCloseModal}
    >
      <form
        className="flex flex-col h-full items-center justify-center gap-y-[30px]"
        onSubmit={handleSubmit(handleSubmitCreateCommunityForm)}
      >
        <header className="mb-[10px]">
          <h2 className="text-s20">커뮤니티 만들기</h2>
        </header>
        <div className="w-full">
          <Controller
            name="communityName"
            control={control}
            rules={{
              validate: {
                communityNameLength: (value) =>
                  (value.length >= 2 && value.length <= 20) ||
                  '커뮤니티 이름은 2자 이상, 20자 이하만 가능합니다!',
              },
            }}
            render={({ field, formState: { errors } }) => {
              return (
                <div className="mb-[12px]">
                  <Input
                    placeholder="커뮤니티 이름"
                    {...field}
                    disabled={createCommunityMutation.isLoading}
                  />
                  <div className="pl-3">
                    {errors?.communityName ? (
                      <ErrorMessage size="sm">
                        {errors.communityName.message}
                      </ErrorMessage>
                    ) : (
                      field.value && (
                        <SuccessMessage size="sm">
                          사용 가능한 이름입니다!
                        </SuccessMessage>
                      )
                    )}
                  </div>
                </div>
              );
            }}
          />
          <Controller
            name="communityDescription"
            control={control}
            rules={{
              validate: {
                communityDescriptionLength: (value) =>
                  value.length <= 20 || '설명은 20자 이하만 가능합니다!',
              },
            }}
            render={({ field, formState: { errors } }) => {
              return (
                <div>
                  <Input
                    placeholder="커뮤니티 설명"
                    {...field}
                    disabled={createCommunityMutation.isLoading}
                  />
                  <div className="pl-3">
                    {errors?.communityDescription && (
                      <ErrorMessage size="sm">
                        {errors.communityDescription.message}
                      </ErrorMessage>
                    )}
                  </div>
                </div>
              );
            }}
          />
        </div>
        <footer className="flex justify-center gap-x-[24px] w-full h-full items-end">
          <h2 className="sr-only">액션 버튼 그룹</h2>
          <Button
            type="button"
            color="error"
            onClick={handleCloseModal}
            width="50%"
          >
            취소하기
          </Button>
          <Button
            type="submit"
            color="success"
            width="50%"
            disabled={createCommunityMutation.isLoading}
          >
            만들기
          </Button>
        </footer>
      </form>
    </ReactModal>
  );
};

export default CreateCommunityModal;