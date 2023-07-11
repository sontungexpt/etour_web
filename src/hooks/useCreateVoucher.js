import { useState } from 'react';
import useSocket from './useSocket';

export default function useCreateVoucher() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const socket = useSocket((socket) => {
        socket.on('create-voucher-result', (data) => {
            setData(data.data);
        });
        socket.on('error', (error) => {
            setError(error);
        });
    }, []);

    function createVoucher(voucherInfo) {
        setData(null);
        setError(null);
        socket.emit('create-voucher', voucherInfo);
    }

    return { createVoucher, data, error };
}
