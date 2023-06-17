import { useState } from 'react';
import useSocket from '../useSocket';
import { STATUS } from '@/constant/status';
import useCallAPIToast from '../useCallAPIToast';

export default function useUpdateTour() {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState();
    const [error, setError] = useState(null);

    useCallAPIToast({
        status,
        message: {
            pending: 'Uploading data...',
            success: 'Update tour successfully',
            fail: `Fail to update tour: ${error?.message}`,
        },
    });

    const socket = useSocket((socket) => {
        socket.on('update-tour-result', (data) => {
            setStatus(STATUS.SUCCESS);
            setData(data.data);
        });
        socket.on('error', (error) => {
            setStatus(STATUS.FAIL);
            setError(error);
        });
    }, []);

    function updateTour(data) {
        setData(null);
        setError(null);
        setStatus(STATUS.PENDING);
        socket.emit('update-tour', data);
    }

    return { updateTour, status, data, error };
}
