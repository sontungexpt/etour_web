import { useState } from 'react';
import usePersistentState from '../usePersistentState';
import useSocket from '../useSocket';

export default function useStaffInformation() {
    const [staffInfo, setStaffInfo] = usePersistentState('staff-info', null);
    const [error, setError] = useState(null);

    useSocket((socket) => {
        socket.emit('view-staff-info');
        socket.on('staff-info', (data) => {
            setStaffInfo(data.data);
        });
        socket.on('error', (error) => {
            setError(error);
        });
    });

    return { data: staffInfo, isError: error !== null, error };
}
