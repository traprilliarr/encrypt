'use client';

import clsx from 'clsx';
import EmptyState from '../../components/EmptyState';
import useConversationHelper from '../../hooks/useConversation';
import ConversationList from './components/ConversationList';

const Home = () => {
  const { isOpen } = useConversationHelper();

  return (
    <div>
      <ConversationList />
      <div
        className={clsx('lg:pl-80 h-full lg:block', isOpen ? 'block' : 'hidden')}
      >
        <EmptyState />
      </div>
    </div>
  );
};

export default Home;
