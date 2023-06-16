import { useEffect, useRef } from "react";
import { STATUS } from "../constant/status";
import { toast } from "react-toastify";

export default function useCallAPIToast({
	status,
	message: { pending, success, fail },
	onPending = () => {},
	onSuccess = () => {},
	onFail = () => {},
	onResponse = () => {},
}) {
	const toastRef = useRef();

	useEffect(() => {
		if (!status) return;
		if (!toastRef.current) toastRef.current = toast.loading(pending);

		if (status == STATUS.PENDING) {
		} else {
			if (status == STATUS.SUCCESS) {
				toast.update(toastRef.current, {
					render: success,
					type: "success",
					isLoading: false,
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
				});
            onSuccess()
			} else if (status == STATUS.FAIL) {
				toast.update(toastRef.current, {
					render: fail,
					type: "fail",
					isLoading: false,
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: false,
				});
            onFail()
			}

			toastRef.current = null;
         onResponse()
		}
	}, [status]);

	useEffect(() => {
		return () => {
			toast.dismiss(toastRef.current);
		};
	}, []);
}