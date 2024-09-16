import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useConversationStore } from "../context/ConversationContext";
import { getMessagesByConversationIdService } from "../services/getConversation";
import useCrypto from "./useCrypto";
import useCurrentUser from "./useCurrentUser";
import useOtherUser from "./useOtherUser";

export type conversation = {
  id: string;
  chat_type: "PERSONAL";
  metadata: any;
  last_message?: message;
  messages: message[];
  members: conversationMember[];
  created_at: Date;
  updated_at: Date;
};

export type message = {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  metadata: Record<string, any>;
  content_type: messageContentType;
  created_at: Date;
  updated_at: Date;
  seen_by: string[];
  seen_by_me: boolean;
  sent_by_me: boolean;
  sender: conversationMember["user"];
};

export enum messageContentType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  DOCUMENT = "DOCUMENT",
}

export type conversationMember = {
  user_id: string;
  user: {
    id: string;
    username: string;
    fullname: string;
    public_key: string;
  };
};

const useConversationHelper = () => {
  const params = useParams();

  const { conversations } = useConversationStore((state) => ({
    conversations: state.conversations,
  }));

  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return "";
    }

    return params?.conversationId as string;
  }, [params?.conversationId]);

  const isOpen = useMemo(() => {
    return !!conversationId;
  }, [conversationId]);

  const conversation = useMemo(() => {
    return conversations.find((conv) => conv.id === params.conversationId);
  }, [conversations, params.conversationId]);

  return useMemo(
    () => ({
      conversationId,
      isOpen,
      conversation,
    }),
    [conversationId, isOpen, conversation]
  );
};

export const useConversationLogic = (conversation: conversation) => {
  const params = useParams();
  const router = useRouter();
  const user = useCurrentUser();

  const { setMessagesOnConversation } = useConversationStore((state) => ({
    conversations: state.conversations,
    setMessagesOnConversation: state.setMessagesOnConversation,
  }));
  const otherUser = useOtherUser(conversation);
  const { encryptMessageForSending, decryptMessage } = useCrypto(
    otherUser.user.public_key
  );

  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return "";
    }

    return params?.conversationId as string;
  }, [params?.conversationId]);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const messages = await getMessagesByConversationIdService(
            user.backend_token,
            conversationId
          );
          const messagesProcessed = messages.map((msg: any) => ({
            ...msg,
            content: decryptMessage(msg.content, msg.metadata.iv),
          }));

          setMessagesOnConversation(conversationId, messagesProcessed);
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status === 403) {
            router.replace("/users");
          }
        }
      })();
    }

    return () => {};
  }, [params.conversationId, router, setMessagesOnConversation, user, conversation, conversationId, decryptMessage]);

  return {
    encryptMessageForSending,
  };
};

export default useConversationHelper;
