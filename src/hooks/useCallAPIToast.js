import { useEffect, useRef } from 'react';
import { STATUS } from '@/constant/status';
import { toast } from 'react-toastify';

export default function useCallAPIToast({
    status,
    message: { pending, success, fail, update = '' },
    onPending = () => {},
    onUpdate = () => {},
    onSuccess = () => {},
    onFail = () => {},
    onResponse = () => {},
}) {
    const toastRef = useRef();

    useEffect(() => {
        if (!status || status === STATUS.IDLE) return;
        if (!toastRef.current)
            toastRef.current = toast.loading(pending, {
                position: 'bottom-left',
                theme: 'colored',
            });

        if (status == STATUS.UPDATE) {
            toast.update(toastRef.current, {
                position: 'bottom-left',
                render: update || success,
                type: 'info',
                isLoading: false,
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                theme: 'colored',
            });
            onUpdate();
            toastRef.current = null;
        } else if (status == STATUS.PENDING) {
        } else {
            if (status == STATUS.SUCCESS) {
                toast.update(toastRef.current, {
                    position: 'bottom-left',
                    render: success,
                    type: 'success',
                    isLoading: false,
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: 'colored',
                });
                onSuccess();
            } else if (status == STATUS.FAIL) {
                toast.update(toastRef.current, {
                    position: 'bottom-left',
                    render: fail,
                    type: 'error',
                    isLoading: false,
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    // theme: "colored",
                });
                onFail();
            }

            toastRef.current = null;
            onResponse();
        }
    }, [status]);

    useEffect(() => {
        return () => {
            toast.dismiss(toastRef.current);
        };
    }, []);
}
