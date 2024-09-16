'use client';

import useConversation, { messageContentType } from '@/app/hooks/useConversation';
import { sendNewMessage } from '@/app/hooks/useMessage';
import axios from 'axios';
import { CldUploadButton } from 'next-cloudinary';
import React from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import socket from '@/app/context/SocketContext';

interface Props {
  encryptMessageForSending: (message: string) => ({
    messageEncryptedHexist: string,
    ivHexist: string,
  })
}

const Form: React.FC<React.PropsWithChildren<Props>> = ({
  encryptMessageForSending
}) => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setValue('message', '', { shouldValidate: false });
    const messagePrepared = encryptMessageForSending(data.message)
    sendNewMessage(socket, {
      content: messagePrepared.messageEncryptedHexist,
      convId: conversationId,
      content_type: messageContentType.TEXT,
      metadata: {
        iv: messagePrepared.ivHexist,
      }
    })
  };

  const handleUpload = (result: any) => {
    axios.post(`/api/messages`, {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="jkyytcex"
      >
        <HiPhoto size={30} className="text-cyan-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-cyan-500 cursor-pointer hover:bg-cyan-600 transition"
        >
          <HiPaperAirplane size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
};
export default Form;
