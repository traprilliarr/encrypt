"use client";

import ConversationContext, { createConversationStore } from '@/app/context/ConversationContext';
import socket, { SocketContext } from '@/app/context/SocketContext';
import { conversation } from '@/app/hooks/useConversation';
import useListenToNewMessage from '@/app/hooks/useMessage';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
    users: any[],
    conversations: conversation[],
    token: string,
}

const ConversationWrapper: React.FC<React.PropsWithChildren<Props>> = ({ children, users, conversations, token }) => {
    const conversationStore = useRef(createConversationStore({
        conversations,
        users,
    })).current;

    const [socketState, setSocketState] = useState(socket)

    useEffect(() => {
        const onConnection = () => {
            console.log('connected to the socket', socket.connected);
            setSocketState(socket)
        };

        socket.on('connect', onConnection)

        if (!socket.connected || socket.disconnected) {
            console.log('connecting socket');
            socket.auth = {
                token: 'Bearer ' + token,
            }
            socket.connect();
        }

        return () => {
            console.log('disconnecting socket');
            socket.off('connect', onConnection);
            socket.disconnect();
        }
    }, [])

    return (
        <ConversationContext.Provider value={conversationStore}>
            <SocketContext.Provider value={{ socket: socketState }}>
                <ConversationWrapperChild token={token}>
                    {children}
                </ConversationWrapperChild>
            </SocketContext.Provider>
        </ConversationContext.Provider>
    )
}

const ConversationWrapperChild: React.FC<React.PropsWithChildren<{ token: string }>> = ({ children, token }) => {
    useListenToNewMessage()
    return (
        <>
            {children}
        </>
    )
}

export default ConversationWrapper