import { useState } from "react";
import useSocket from "./useSocket";

export default function useVoucherList({ num = 1000 }) {
	const [vouchers, setVouchers] = useState([]);
	const [error, setError] = useState(null);

	useSocket(
		(socket) => {
			socket.emit("view-new-voucher", { num });
			socket.on("new-voucher-list", (data) => {
				setVouchers(data.data);
			});
			socket.on("error", (error) => {
				setError(error);
			});
		},
		[vouchers.join(""), num]
	);

	return { data: vouchers, isError: error !== null, error };
}
