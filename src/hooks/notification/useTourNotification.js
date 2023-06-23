import { useContext, useEffect, useState } from 'react';
import useSocket from '../useSocket';
import { STATUS } from '@/constant/status';
import useCallAPIToast from '../useCallAPIToast';
import SocketContext from '@/contexts/SocketContext';
import usePersistentState from '../usePersistentState';

export default function useTourNotification(id) {
    const [data, setData] = usePersistentState(`tour-notification-${id}`, []);
    const [status, setStatus] = useState();
    const [error, setError] = useState(null);
    const { socket: globalSocket } = useContext(SocketContext);

    useCallAPIToast({
        status,
        message: {
            pending: 'Loading tour notification list data...',
            success: 'Successfully load tour notification list data',
            fail: `Fail to load tour notification list data: ${error?.message}`,
        },
    });

    useEffect(() => {
        if (globalSocket) setStatus(STATUS.PENDING);
    }, [!!globalSocket]);

    useSocket(
        (socket) => {
            socket.emit('view-tour-notification', { tourId: id });
            socket.on('tour-notification', (data) => {
                setStatus(STATUS.SUCCESS);
                setData(data.data);
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
