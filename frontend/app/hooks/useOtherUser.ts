import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { conversation } from './useConversation';

const useOtherUser = (
  conversation: conversation
) => {

  // @ts-ignore:next-line
  const { data }: any = useSession<true>();

  const otherUser = useMemo(() => {
    const currentUserId = data?.user_id;

    const otherUser = conversation.members.filter(
      (user) => user.user_id !== currentUserId
    );

    return otherUser[0];
  }, [data?.user_id, conversation.members]);

  return otherUser;
};

export default useOtherUser;
