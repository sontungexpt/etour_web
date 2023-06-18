import { useContext, useEffect, useState } from 'react';
import useSocket from '../useSocket';
import { STATUS } from '@/constant/status';
import useCallAPIToast from '../useCallAPIToast';
import SocketContext from '@/contexts/SocketContext';
import usePersistentState from '../usePersistentState';

export default function useTourByRouteId(id) {
    const [data, setData] = usePersistentState(`tour-of-route-${id}`, []);
    const [status, setStatus] = useState();
    const [error, setError] = useState(null);
    const { socket: globalSocket } = useContext(SocketContext);

    useCallAPIToast({
        status,
        message: {
            pending: 'Loading tour list data...',
            success: 'Successfully load tour list data',
            fail: `Fail to load tour list data: ${error?.message}`,
        },
    });

    useEffect(() => {
        if (globalSocket) setStatus(STATUS.PENDING);
    }, [!!globalSocket]);

    useSocket(
        (socket) => {
            socket.emit('filter-tour', { touristRoute: id });
            socket.on('list-tour', (data) => {
                setStatus(STATUS.SUCCESS);
                setData(data.data);
            });
            socket.on('tour', (data) => {
                setStatus(STATUS.UPDATE);
                setData((prev) => [data.data, ...prev]);
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
