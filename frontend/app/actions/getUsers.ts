import getUsersForChatService from '../services/getUsersForChat';
import getSession from './getSession';

const getUsers = async () => {
  try {
    const session: any = await getSession();

    if (!session?.backend_token) return [];

    const users = await getUsersForChatService(session.backend_token);

    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
