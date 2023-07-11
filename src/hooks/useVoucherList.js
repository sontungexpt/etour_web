import { useState } from 'react';
import useSocket from './useSocket';

export default function useVoucherList({ num = 1000 }) {
    const [vouchers, setVouchers] = useState([]);
    const [error, setError] = useState(null);

    useSocket(
        (socket) => {
            socket.emit('view-company-voucher', { num });
            socket.on('view-company-voucher-result', (data) => {
                setVouchers(data.data);
            });
            socket.on('error', (error) => {
                setError(error);
            });
        },
        [vouchers.join(''), num]
    );

    return { data: vouchers, isError: error !== null, error };
}
