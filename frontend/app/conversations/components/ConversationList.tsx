'use client';

import { useConversationStore } from '@/app/context/ConversationContext';
import useConversation from '@/app/hooks/useConversation';
import clsx from 'clsx';
import { useState } from 'react';
import ConversationBox from './ConversationBox';
import GroupChatModal from './GroupChatModal';


const ConversationList: React.FC = ({
}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, conversationId } = useConversation();

  const users = useConversationStore(state => state.users);
  const conversations = useConversationStore(state => state.conversations);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          'fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200',
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 py-4 border-b">
            <div className="text-2xl font-bold text-neutral-800">Chats</div>
            {/* <div
              onClick={() => setIsModalOpen(true)}
              title="Create a group chat"
              className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
            > */}
            {/* <MdOutlineGroupAdd size={20} /> */}
            {/* </div> */}
          </div>

          {[...conversations].map((conversation) => (
            <ConversationBox
              key={conversation.id}
              conversation={conversation}
              selected={conversationId === conversation.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};
export default ConversationList;
