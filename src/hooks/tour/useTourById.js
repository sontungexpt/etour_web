import { useContext, useEffect, useState } from 'react';
import useSocket from '../useSocket';
import { STATUS } from '@/constant/status';
import useCallAPIToast from '../useCallAPIToast';
import SocketContext from '@/contexts/SocketContext';

export default function useTourById(id) {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState();
    const [error, setError] = useState(null);
    const { socket: globalSocket } = useContext(SocketContext);

    useCallAPIToast({
        status,
        message: {
            pending: 'Loading tour data...',
            success: 'Successfully load tour data',
            fail: `Fail to load tour data: ${error?.message}`,
        },
    });

    useEffect(() => {
        if (globalSocket) setStatus(STATUS.PENDING);
    }, [!!globalSocket]);

    useEffect(() => {
        // if (status == STATUS.SUCCESS) setStatus("");
    }, [status]);

    useSocket(
        (socket) => {
            socket.emit('view-tour', { id });
            socket.on('tour', (data) => {
                if (data.status == '403') {
                    setStatus(STATUS.FAIL);
                    setError(data);
                } else {
                    setStatus(STATUS.SUCCESS);
                    setData(data.data);
                }
            });
            socket.on('error', (error) => {
                setStatus(STATUS.FAIL);
                setError(error);
            });
        },
        [id]
    );

    return { data, status, isError: error !== null, error };
}
