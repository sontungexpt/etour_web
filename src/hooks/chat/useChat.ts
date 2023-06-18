import React from 'react';
import useSocket from '../useSocket';

export interface IChatItem {
    _id?: string;
    uid: string;
    content: string;
    createdAt?: Date;
}

export interface IChat {
    _id?: string;
    userId: string;
    staffId: string;
    chats: IChatItem[];
    routeId: string;
}

export interface IAutoStaffChat {
    userId: string;
    routeId: string;
}

export interface ISendMessage {
    chatRoomId: string;
    content: string;
}

export default function useChat(chatRoomId?: string) {
    const [messages, setMessages] = React.useState<IChatItem[] | undefined>(undefined);
    const [rooms, setRooms] = React.useState<IChat[] | undefined>(undefined);
    const [room, setRoom] = React.useState<IChat | undefined>(undefined);
    const [error, setError] = React.useState();
    const socket = useSocket((socket) => {
        socket.emit('view-chat-room-list', {});
        socket.on('chat-room-list', (data) => {
            setRooms(data.data);
        });
        socket.on('create-chat-result', (data) => {
            setRooms((prev) => [...(prev || []), data.data]);
        });
        socket.on('create-chat-message-result', (data) => {
            if (data.data._id === chatRoomId) {
                setRooms((rooms) => {
                    if (rooms) {
                        const index = rooms.findIndex((room) => room._id === data.data._id);
                        if (index > -1) {
                            rooms[index] = data.data;
                        }
                        return [...rooms];
                    }
                    return [data.data];
                });
                setMessages(data.data.chats);
            }
        });
        // chatRoomId && socket.emit('view-chat-message', { chatRoomId: chatRoomId });
        socket.on('chat-message-list', (data) => {
            setMessages(data.data.messages);
        });

        socket.on('new-chat-message', (data) => {
            setMessages((messages) => {
                if (messages) {
                    return [...messages, data];
                }
                return [data];
            });
        });

        socket.on('error', (err) => {
            setError(err);
        });
    }, []);

    function sendMessage(data: ISendMessage) {
        socket?.emit('create-chat-message', data);
    }

    function viewChatMessageWithRoomId(chatRoomId: string) {
        socket?.emit('view-chat-message', { chatRoomId });
    }

    return {
        viewChatMessageWithRoomId,
        sendMessage,
        room,
        rooms,
        error,
        isError: !!error,
        socket,
    };
}
