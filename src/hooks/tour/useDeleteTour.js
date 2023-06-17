import { useState } from "react";
import useSocket from "../useSocket";
import { STATUS } from "../../constant/status";

export default function useDeleteTour() {
	const [data, setData] = useState(null);
	const [status, setStatus] = useState();
	const [error, setError] = useState(null);

	const socket = useSocket((socket) => {
		socket.on("delete-tour-result", (data) => {
			setData(data.data);
			setStatus(STATUS.SUCCESS);
		});
		socket.on("error", (error) => {
			setError(error);
			setStatus(STATUS.FAIL);
		});
	}, []);

	function deleteTour(newData) {
		setData(null);
		setError(null);
		socket.emit("delete-tour", newData);
		setStatus(STATUS.PENDING);
	}

	return { deleteTour, status, data, error };
}
