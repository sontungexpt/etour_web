import { STATUS } from '@/constant/status';
import { createContext } from 'react';

const SocketContext = createContext({
    socket: null,
    setSocket: (newSocket: any) => {},
    socketStatus: STATUS.IDLE,
    setSocketStatus: (newStatus: any) => {},
});

export default SocketContext;
