'use client';
import { createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';

interface SocketContextValue {
    socket: Socket
}

const socket = io('ws://localhost:5000', {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    transports: ['websocket'],
});

export const SocketContext = createContext<SocketContextValue>({} as any);
export const useSocketContext = () => useContext(SocketContext);

export default socket