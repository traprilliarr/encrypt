"use client";

import EmptyState from '@/app/components/EmptyState';
import useConversationHelper, { useConversationLogic } from '@/app/hooks/useConversation';
import Body from './components/Body';
import Form from './components/Form';
import Header from './components/Header';

interface IParams {
  conversationId: string;
}

const ConversationId = ({ params }: { params: IParams }) => {

  const { conversation } = useConversationHelper()

  if (!conversation) {
    return (
      <div className="h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { encryptMessageForSending } = useConversationLogic(conversation)

  return (
    <div className="h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body messages={conversation.messages} />
        <Form encryptMessageForSending={encryptMessageForSending} />
        <div className="h-12 lg:h-0 border"></div>
      </div>
    </div>
  );
};

export default ConversationId;
