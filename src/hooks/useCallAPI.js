import { useState } from 'react';
import useSocket from './useSocket';
import { STATUS } from '@/constant/status';

export function useSendDataAPI(clientEvent, serverEvent) {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState(STATUS.PENDING);
    const [error, setError] = useState(null);

    const socket = useSocket((socket) => {
        socket.on(serverEvent, (data) => {
            if (data.status != '200') {
                setStatus(STATUS.FAIL);
                setError(data);
            } else {
                setStatus(STATUS.SUCCESS);
                setData(data.data);
            }
        });
        socket.on('error', (error) => {
            setError(error);
        });
    }, []);

    function sendData(newData) {
        setData(null);
        setError(null);
        socket.emit(clientEvent, newData);
        setStatus(STATUS.PENDING);
    }

    return { sendData, data, status, error };
}

export default function useGetAPI(clientEvent, serverEvent, emitData) {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState(STATUS.PENDING);
    const [error, setError] = useState(null);

    useSocket((socket) => {
        socket.emit(clientEvent, emitData);
        socket.on(serverEvent, (data) => {
            if (data.status != '200') {
                setStatus(STATUS.FAIL);
                setError(data);
            } else {
                setStatus(STATUS.SUCCESS);
                setData(data.data);
            }
        });
        socket.on('error', (error) => {
            setError(error);
        });
    }, []);

    return { data, isError: error !== null, status, error };
}
