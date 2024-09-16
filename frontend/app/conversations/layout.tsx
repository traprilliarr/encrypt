import { Metadata } from 'next';
import getConversations from '../actions/getConversations';
import getCurrentUser from '../actions/getCurrentUser';
import getUsers from '../actions/getUsers';
import Sidebar from '../components/sidebar/Sidebar';
import ConversationWrapper from './components/ConversationWrapper';

export const metadata: Metadata = {
  title: 'My Conversations | Nexus - Your Ultimate Chat Experience',
};

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  const conversations = await getConversations();
  const user = await getCurrentUser();

  return (
    // passed to store by react context
    <ConversationWrapper token={user!.backend_token} users={users} conversations={conversations}>
      <Sidebar user={user}>
        <div className="h-full">
          {children}
        </div>
      </Sidebar>
    </ConversationWrapper>
  );
}
