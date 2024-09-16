import getCurrentUser from './getCurrentUser';

const getConversationById = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    return null;
  } catch (error: any) {
    return null;
  }
};

export default getConversationById;
