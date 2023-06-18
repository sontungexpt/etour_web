import { selectBasicInformation } from '@/features/staffSlice';
import useChat from '@/hooks/chat/useChat';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ChatPage.module.scss';
import LOGO from '@/assets/logo.svg';
import ENDPOINT from '@/constant/endponint';
import { randomUUID } from '@/lib/operation';

const ChatPage = () => {
    const { id } = useParams();
    const { rooms } = useChat(id);
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <img onClick={() => navigate(ENDPOINT.HOME)} src={LOGO} alt="Logo" />
            {rooms ? (
                rooms.length > 0 ? (
                    rooms.map((room) => {
                        return <ChatItem room={room} key={room._id + randomUUID()} param={id} />;
                    })
                ) : (
                    <p
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        No rooms
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
            )}
        </div>
    );
};

export default ChatPage;

const ChatItem = ({ room, param }) => {
    const staff = useSelector(selectBasicInformation);
    const navigate = useNavigate();
    const lastMessage = room.chats.slice(-1)[0] || null;
    const isStaffMessage = lastMessage?.uid === staff?._id;
    const isCustomerMessage = lastMessage?.uid === room.userId;
    const whoseMessage = isStaffMessage ? 'You: ' : isCustomerMessage ? 'Customer: ' : 'Other: ';

    const handleOnClickMessage = () => {
        navigate(`/chat/${room._id}`);
    };

    return (
        <div
            className={styles.chatItem}
            onClick={handleOnClickMessage}
            role="button"
            style={{
                backgroundColor: param === room._id ? '#F9F9F9' : 'white',
            }}
        >
            <p>
                <b>Room ID: {room?._id?.slice(0, 6)?.toUpperCase()}</b>
            </p>
            {lastMessage && (
                <div className={styles.lastMessage}>
                    <p
                        style={{
                            maxWidth: '240px',
                        }}
                    >
                        {whoseMessage} {lastMessage?.content || 'No message yet'}
                    </p>
                    <p>{moment(lastMessage?.createdAt).fromNow()}</p>
                </div>
            )}
        </div>
    );
};
