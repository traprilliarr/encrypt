'use client';

import useConversation, { message } from '@/app/hooks/useConversation';
import useCurrentUser from '@/app/hooks/useCurrentUser';
import seenMessageService from '@/app/services/seenMessage';
import { useEffect, useRef } from 'react';
import MessageBox from './MessageBox';

interface BodyProps {
  messages: message[];
}

const Body: React.FC<BodyProps> = ({ messages = [] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();
  const currentUser = useCurrentUser();

  useEffect(() => {
    bottomRef?.current?.scrollIntoView(false);

    // mark message as seen
    const messageHandler = (message: message) => {
      seenMessageService(currentUser!.backend_token, conversationId, message.id);
      bottomRef?.current?.scrollIntoView();
    };

    return () => { };
  }, [conversationId, currentUser, messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {[...messages].reverse().map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}

      <div ref={bottomRef} className="pt-8" />
    </div>
  );
};
export default Body;
