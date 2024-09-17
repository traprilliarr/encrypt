"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import { useConversationStore } from "../context/ConversationContext";
import { useCryptoContext } from "../context/CryptoContext";
import { useSocketContext } from "../context/SocketContext";
import { decryptConversation } from "../libs/conversation/utils";
import {
  deriveSharedSecret,
  deserializeECDHPublicKey,
} from "../libs/crypto/ecdh";
import { hexistsToArrayBuffer } from "../libs/crypto/util";
import { messageContentType } from "./useConversation";
import useCurrentUser from "./useCurrentUser";
import { signOut } from "next-auth/react";

type sendNewMessage = {
  content: string;
  convId: string;
  content_type: messageContentType;
  metadata: {
    iv: string;
  };
};

const socketEvents = {
  sendNewMessage: "send_new_message",
  receiveNewMessage: "receive_new_message",
};

type newMessageComesIn = {
  sender: {
    id: string;
    username: string;
    fullname: string;
    public_key: string;
  };
  seen_by: {
    user_id: string;
  }[];
  seen_by_me: boolean;
  sent_by_me: boolean;
} & {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  metadata: {
    iv: string;
  };
  content_type: messageContentType;
  created_at: Date;
  updated_at: Date;
};

function scrolltobottom() {
  document.getElementById("bottom")?.scrollIntoView();
}

export const sendNewMessage = (socket: Socket, data: sendNewMessage) => {
  if (socket.connected) {
    console.log("sended message");
    scrolltobottom();
    socket.emit(socketEvents.sendNewMessage, data);
  } else {
    toast.error("Anda sedang offline. Silahkan refresh");
  }
};

export const useListenToNewMessage = () => {
  const user = useCurrentUser();
  const { socket: socketParam } = useSocketContext();
  const { loggedInUserKey } = useCryptoContext();
  const { conversations, addNewMessage } = useConversationStore((state) => ({
    conversations: state.conversations,
    addNewMessage: state.addNewMessage,
  }));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const findReceiver = (conversationId: string, senderId: string) => {
    const conv = conversations.find((conv) => conv.id === conversationId);
    if (!conv) {
      return null;
    }

    return conv.members.filter((member) => member.user_id !== senderId);
  };

  useEffect(() => {
    if (!loggedInUserKey || !loggedInUserKey.privateKey) {
      signOut();
      return;
    }

    const newMessageHandler = (data: newMessageComesIn) => {
      let [privateKey, publicKey] = [
        loggedInUserKey.privateKey,
        deserializeECDHPublicKey(data.sender.public_key),
      ];

      // if message is sent by me, then reverse the key
      if (data.sender_id === user?.user_id) {
        const receiver = findReceiver(data.chat_id, data.sender_id)![0];
        publicKey = deserializeECDHPublicKey(receiver.user.public_key);
      }

      const sharedSecret = deriveSharedSecret(privateKey, publicKey);
      const iv = hexistsToArrayBuffer(data.metadata.iv);
      const message = hexistsToArrayBuffer(data.content);

      data.content = decryptConversation(
        new Uint8Array(message),
        new Uint8Array(sharedSecret),
        new Uint8Array(iv)
      );

      addNewMessage(data.chat_id, {
        id: data.id,
        chat_id: data.chat_id,
        content: data.content,
        content_type: data.content_type,
        created_at: data.created_at,
        updated_at: data.updated_at,
        metadata: data.metadata,
        seen_by: data.seen_by.map((x) => x.user_id),
        seen_by_me: data.seen_by_me,
        sent_by_me: data.sent_by_me,
        sender: data.sender,
        sender_id: data.sender_id,
      });
      scrolltobottom();
    };

    if (socketParam.connected) {
      socketParam.on(socketEvents.receiveNewMessage, newMessageHandler);
    }

    return () => {
      socketParam.off(socketEvents.receiveNewMessage, newMessageHandler);
    };
  }, [
    socketParam,
    socketParam.connected,
    user,
    addNewMessage,
    findReceiver,
    loggedInUserKey,
  ]);

  return {};
};

export default useListenToNewMessage;
