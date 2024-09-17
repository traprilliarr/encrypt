"use client";

import useConversation, { message } from "@/app/hooks/useConversation";
import useCurrentUser from "@/app/hooks/useCurrentUser";
import seenMessageService from "@/app/services/seenMessage";
import { useEffect } from "react";
import MessageBox from "./MessageBox";

interface BodyProps {
  messages: message[];
}

const Body: React.FC<BodyProps> = ({ messages = [] }) => {
  const { conversationId } = useConversation();
  const currentUser = useCurrentUser();

  useEffect(() => {
    // mark message as seen
    const messageHandler = (message: message) => {
      seenMessageService(
        currentUser!.backend_token,
        conversationId,
        message.id
      );
    };

    return () => {};
  }, [conversationId, currentUser, messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {[...messages].reverse().map((message, i) => (
        <MessageBox isLast={i === messages.length - 1} key={i} data={message} />
      ))}

      <div id="bottom" className="pt-8" />
    </div>
  );
};
export default Body;
