import { getConversationsService } from "../services/getConversation";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) return [];

    const conversations = await getConversationsService(
      (currentUser as any).backend_token
    );

    if (!conversations) return [];

    const decryptedConvs =
      conversations?.map((conv: any) => {
        return {
          ...conv,
          messages:
            conv?.messages?.map((msg: any) => ({
              ...msg,
              // content: decryptConversation(msg.content, 'SECRET', msg.metadata.iv),
            })) || [],
          last_message: conv?.last_message
            ? {
                ...conv?.last_message,
                // content: decryptConversation(conv?.last_message?.content, 'SECRET', conv?.last_message?.metadata.iv)
              }
            : null,
        };
      }) || [];

    return decryptedConvs;
  } catch (error: any) {
    console.log("error get conversations", error);
    return [];
  }
};

export default getConversations;
