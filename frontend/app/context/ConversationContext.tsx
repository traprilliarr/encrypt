'use client';
import type { } from '@redux-devtools/extension'; // required for devtools typing
import { createContext, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { conversation, message } from '../hooks/useConversation';
import type { } from '@redux-devtools/extension'
import _ from 'lodash';


interface conversationProps {
    conversations: conversation[];
    users: any[];
};

interface conversationState extends conversationProps {
    addNewConversation: (conversation: conversation) => void;
    addNewMessage: (conversationId: string, message: message) => void;
    setMessagesOnConversation: (conversationId: string, messages: message[]) => void;
}

export const createConversationStore = (initProps?: Partial<conversationProps>) => {
    const DEFAULT_PROPS: conversationProps = {
        conversations: [],
        users: [],
    }

    return createStore<conversationState>()(
        devtools(
            immer((set) => ({
                ...DEFAULT_PROPS,
                ...initProps,
                addNewConversation: (conv) => {
                    set(state => {
                        const newConversations = [{ ...conv }, ...state.conversations];
                        state.conversations = newConversations;
                    })
                },
                addNewMessage: (convId, message) => {
                    set(state => {

                        const convIdx = state.conversations.findIndex(c => c.id === convId);
                        if (convIdx === -1) {
                            return;
                        }

                        const conv = { ...state.conversations[convIdx] };
                        conv.messages = [message, ...conv.messages]

                        // move new conv to first element
                        conv.last_message = message;
                        state.conversations = [conv, ...state.conversations.slice(0, convIdx), ...state.conversations.slice(convIdx + 1)];
                    })
                },
                setMessagesOnConversation: (convId, messages) => {
                    set(state => {
                        const convIdx = state.conversations.findIndex(c => c.id === convId);
                        if (convIdx === -1) {
                            return;
                        }

                        state.conversations[convIdx].messages = messages
                    })
                },
            })),
        )
    )
}

export type ConversationStore = ReturnType<typeof createConversationStore>

export type ConversationProviderProps = React.PropsWithChildren<conversationProps>

export const ConversationContext = createContext<ConversationStore | null>(null)

export function useConversationStore<T>(selector: (state: conversationState) => T): T {
    const store = useContext(ConversationContext)
    if (!store) throw new Error('Missing ConversationContext.Provider in the tree')
    return useStore(store, selector)
}

export default ConversationContext;