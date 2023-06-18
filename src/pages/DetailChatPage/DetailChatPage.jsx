import { selectBasicInformation } from '@/features/staffSlice';
import useChat from '@/hooks/chat/useChat';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './DetailChatPage.module.scss';
import { Button } from '@mui/material';
import moment from 'moment';
import ChatPage from '../ChatPage/ChatPage';
import SocketContext from '@/contexts/SocketContext';
import { randomUUID } from '@/lib/operation';

const DetailChatPage = () => {
    const { id } = useParams();
    const { sendMessage, viewChatMessageWithRoomId, isError } = useChat(id);
    const [messagesState, setMessagesState] = React.useState();
    const { socket } = useContext(SocketContext);
    const scrollRef = useRef();
    useEffect(() => {
        if (socket) {
            socket.on('chat-message-list', (data) => {
                setMessagesState(data.data.messages);
            });

            socket.on('new-chat-message', (data) => {
                console.log('new-chat-message', data);
                console.log({ data });
                const { chatRoomId } = data;
                if (chatRoomId !== id) return;
                setMessagesState((messages) => {
                    if (messages) {
                        return [...messages, data];
                    }
                    return [data];
                });
                // socket.emit('view-chat-room-list', {});
            });
        }
    }, [socket, id]);

    useEffect(() => {
        viewChatMessageWithRoomId(id);
    }, [id, socket]);

    useEffect(() => {
        if (messagesState) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [id, messagesState]);

    useEffect(() => {
        return () => {
            socket?.off('chat-message-list');
            socket?.off('new-chat-message');
            setMessagesState(null);
        };
    }, [id]);

    const staff = useSelector(selectBasicInformation);

    const [message, setMessage] = React.useState('');

    const handleSendMessage = useCallback(() => {
        setMessage('');
        setMessagesState((prev) => [
            ...prev,
            {
                _id: randomUUID(),
                content: message,
                uid: staff._id,
                createdAt: new Date(),
            },
        ]);
        sendMessage({
            chatRoomId: id,
            content: message,
        });
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message, id]);

    return (
        <div className={styles.hoc}>
            <div
                style={{
                    position: 'relative',
                    maxHeight: '100vh',
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <ChatPage />
            </div>
            <div className={styles.container}>
                {id ? (
                    messagesState ? (
                        messagesState.length > 0 ? (
                            <>
                                {messagesState.map((message) => {
                                    const isCustomerMessage = message.uid !== staff._id;
                                    return (
                                        <div
                                            key={message._id + randomUUID()}
                                            className={styles.message}
                                            style={{
                                                alignSelf: isCustomerMessage
                                                    ? 'flex-start'
                                                    : 'flex-end',
                                                marginRight: isCustomerMessage ? 10 : 0,
                                                marginLeft: isCustomerMessage ? 0 : 10,

                                                backgroundColor: isCustomerMessage
                                                    ? '#fff'
                                                    : '#0084FF',
                                            }}
                                        >
                                            <p
                                                style={{
                                                    color: isCustomerMessage ? 'black' : 'white',
                                                    fontSize: '0.87rem',
                                                }}
                                            >
                                                {message.content}
                                            </p>
                                            <cite
                                                style={{
                                                    color: isCustomerMessage ? 'gray' : 'white',
                                                    fontSize: '0.7rem',
                                                    opacity: 0.8,
                                                }}
                                            >
                                                {moment(message.createdAt).format(
                                                    'DD/MM/YYYY HH:mm'
                                                )}
                                            </cite>
                                        </div>
                                    );
                                })}
                                <div style={{ float: 'left', clear: 'both' }} ref={scrollRef}></div>
                            </>
                        ) : (
                            <p
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                No messages
                            </p>
                        )
                    ) : (
                        <p
                            style={{
                                textAlign: 'center',
                            }}
                        >
                            Loading...
                        </p>
                    )
                ) : (
                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: '2rem',
                            color: 'gray',
                        }}
                    >
                        Choose a room to start chat
                    </p>
                )}
                <div
                    className={styles.inputContainer}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                >
                    <input
                        type="text"
                        placeholder="Type a message..."
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        disabled={!id && !messagesState}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            borderRadius: '100px',
                            boxShadow: 'none',
                            padding: '0 2rem',
                            backgroundColor: '#0084FF',
                        }}
                        disabled={!message}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DetailChatPage;
