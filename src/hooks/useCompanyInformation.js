import { useState } from 'react';
import usePersistentState from './usePersistentState';
import useSocket from './useSocket';

export default function useCompanyInformation() {
    const [companyInfo, setCompanyInfo] = usePersistentState('company-info', null);
    const [error, setError] = useState(null);

    useSocket((socket) => {
        socket.emit('view-company-info');
        socket.on('company-info', (data) => {
            setCompanyInfo(data.data);
        });
        socket.on('error', (error) => {
            setError(error);
        });
    }, []);

    return { data: companyInfo, isError: error !== null, error };
}
