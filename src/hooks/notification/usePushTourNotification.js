import { useState } from 'react';
import useSocket from '../useSocket';
import { STATUS } from '@/constant/status';
import useCallAPIToast from '../useCallAPIToast';

export default function usePushTourNotification() {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState();
    const [error, setError] = useState(null);

    useCallAPIToast({
        status,
        message: {
            pending: 'Uploading data...',
            success: 'Push notification successfully',
            fail: `Fail to push notification: ${error?.message}`,
        },
    });

    const socket = useSocket((socket) => {
        socket.on('push-to-tour-customer-result', (data) => {
            setStatus(STATUS.SUCCESS);
            setData(data.data);
        });
        socket.on('error', (error) => {
            setStatus(STATUS.FAIL);
            setError(error);
        });
    }, []);

    function pushTourNotification(data) {
        setData(null);
        setError(null);
        setStatus(STATUS.PENDING);
        socket.emit('push-to-tour-customer', data);
    }

    return { pushTourNotification, status, data, error };
}
