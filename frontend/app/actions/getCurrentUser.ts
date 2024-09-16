import getSession from './getSession';

const getCurrentUser = async () => {
  try {
    const session: any = await getSession();

    if (!session) {
      return null;
    }

    // const userFromAPI = await getLoggedInUserService(session.backend_token);

    return {
      username: session.username,
      fullname: session.fullname,
      id: session.user_id,
      backend_token: session.backend_token,
    };
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;