import type { FC } from 'react';

import Button from '@components/Button';
import CheckBox from '@components/CheckBox';
import ErrorMessage from '@components/ErrorMessage';
import Input from '@components/Input';
import SuccessMessage from '@components/SuccessMessage';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import { HashtagIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import {
  useCreateChannelMutation,
  useSetChannelQueryData,
} from '@hooks/channel';
import { useRootStore } from '@stores/rootStore';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface ChannelCreateFormFields {
  channelName: string;
  isPrivate: boolean;
  channelDescription: string;
  profileUrl: string;
}

const channelCreateFormDefaultValue = {
  channelName: '',
  isPrivate: false,
  channelDescription: '',
  profileUrl: '',
};

export interface Props {
  communityId: string;
}

const ChannelCreateBox: FC<Props> = ({ communityId }) => {
  const navigate = useNavigate();
  const closeCommonModal = useRootStore((state) => state.closeCommonModal);

  const { addChannelQueryData } = useSetChannelQueryData();
  const createChannelMutation = useCreateChannelMutation({
    onSuccess: (createdChannel) => {
      addChannelQueryData(communityId, createdChannel);
      closeCommonModal();
      navigate(`/communities/${communityId}/channels/${createdChannel._id}`);
    },
    onError: (error) => {
      defaultErrorHandler(error);
    },
  });

  const { control, handleSubmit, reset, watch } =
    useForm<ChannelCreateFormFields>({
      mode: 'all',
      defaultValues: channelCreateFormDefaultValue,
    });

  const isPrivate = watch('isPrivate');

  const handleCloseModal = () => {
    closeCommonModal();
    reset();
  };

  const handleSubmitChannelCreateForm = (fields: ChannelCreateFormFields) => {
    const {
      channelName: name,
      channelDescription: description,
      isPrivate: _isPrivate,
      profileUrl,
    } = fields;

    createChannelMutation.mutate({
      communityId,
      name,
      description,
      isPrivate: _isPrivate,
      profileUrl,
    });
  };

  return (
    <div className="w-[350px] h-[auto] p-[20px]">
      <form
        className="flex flex-col h-full items-center justify-center gap-y-[30px]"
        onSubmit={handleSubmit(handleSubmitChannelCreateForm)}
      >
        <header>
          <h2 className="flex text-s20 items-center">
            {isPrivate ? (
              <>
                <LockClosedIcon className="w-6 h-6 mr-[4px]" />
                <span>????????? ?????? ?????????</span>
              </>
            ) : (
              <>
                <HashtagIcon className="w-6 h-6 mr-[4px]" />
                <span>?????? ?????????</span>
              </>
            )}
          </h2>
        </header>
        <div className="w-full">
          <Controller
            name="channelName"
            control={control}
            rules={{
              validate: {
                channelNameLength: (value) =>
                  (value.length >= 2 && value.length <= 20) ||
                  '?????? ????????? 2??? ??????, 20??? ????????? ???????????????!',
              },
            }}
            render={({ field, formState: { errors } }) => {
              return (
                <div className="mb-[12px]">
                  <Input
                    placeholder="?????? ??????"
                    {...field}
                    disabled={createChannelMutation.isLoading}
                  />
                  <div className="pl-3">
                    {errors?.channelName ? (
                      <ErrorMessage size="sm">
                        {errors.channelName.message}
                      </ErrorMessage>
                    ) : (
                      field.value && (
                        <SuccessMessage size="sm">
                          ?????? ????????? ???????????????!
                        </SuccessMessage>
                      )
                    )}
                  </div>
                </div>
              );
            }}
          />
          <Controller
            name="channelDescription"
            control={control}
            rules={{
              validate: {
                communityDescriptionLength: (value) =>
                  value.length <= 20 || '????????? 20??? ????????? ???????????????!',
              },
            }}
            render={({ field, formState: { errors } }) => {
              return (
                <div className="mb-[24px]">
                  <Input
                    placeholder="?????? ??????"
                    {...field}
                    disabled={createChannelMutation.isLoading}
                  />
                  <div className="pl-3">
                    {errors?.channelDescription && (
                      <ErrorMessage size="sm">
                        {errors.channelDescription.message}
                      </ErrorMessage>
                    )}
                  </div>
                </div>
              );
            }}
          />

          <Controller
            name="isPrivate"
            control={control}
            render={({ field: { name, onChange, onBlur, ref, value } }) => {
              return (
                <div className="flex items-center gap-[6px] px-[8px]">
                  <CheckBox
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    checked={value}
                    ref={ref}
                  />
                  <span>????????? ??????</span>
                </div>
              );
            }}
          />
        </div>
        <footer className="flex justify-center gap-x-[24px] w-full h-full items-end">
          <h2 className="sr-only">?????? ?????? ??????</h2>
          <Button
            type="button"
            color="error"
            onClick={handleCloseModal}
            width="50%"
            disabled={createChannelMutation.isLoading}
          >
            ????????????
          </Button>
          <Button
            type="submit"
            color="dark"
            width="50%"
            disabled={createChannelMutation.isLoading}
          >
            ?????????
          </Button>
        </footer>
      </form>
    </div>
  );
};

export default ChannelCreateBox;
