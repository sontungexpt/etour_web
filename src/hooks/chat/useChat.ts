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
    const [lastMessage, setLastMessage] = React.useState<IChatItem | undefined>(undefined);
    const socket = useSocket(
        (socket) => {
            socket.emit('view-chat-room-list', {});
            socket.on('chat-room-list', (data) => {
                setRooms(data.data);
            });
            socket.on('create-chat-result', (data) => {
                setRooms((prev) => [...(prev || []), data.data]);
            });
            socket.on('create-chat-message-result', (data) => {
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
                setLastMessage(data.data.chats.slice(-1)[0]);
            });
            // chatRoomId && socket.emit('view-chat-message', { chatRoomId: chatRoomId });
            socket.on('chat-message-list', (data) => {
                console.log({ chatRoomId, roomId: data.data.chatRoomId });
                if (data.data.chatRoomId == chatRoomId) {
                    setMessages(data.data.messages);
                    setLastMessage(data.data.messages.slice(-1)[0]);
                }
            });

            socket.on('new-chat-message', (data) => {
                if (data.chatRoomId != chatRoomId) return;
                setMessages((messages) => {
                    if (messages) {
                        return [...messages, data];
                    }
                    return [data];
                });
                setLastMessage(data);
            });

            socket.on('error', (err) => {
                setError(err);
            });
        },
        [chatRoomId]
    );

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
        messages,
        error,
        isError: !!error,
        lastMessage,
        socket,
    };
}
