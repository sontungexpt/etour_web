import { useState } from "react";
import useSocket from "../useSocket";
import { STATUS } from "../../constant/status";

export default function useCreateTour() {
	const [data, setData] = useState(null);
	const [status, setStatus] = useState();
	const [error, setError] = useState(null);

	const socket = useSocket((socket) => {
		socket.on("create-tour-result", (data) => {
			setStatus(STATUS.SUCCESS);
			setData(data.data);
		});
		socket.on("error", (error) => {
			setStatus(STATUS.FAIL);
			setError(error);
		});
	}, []);

	function createTour(data) {
		setData(null);
		setError(null);
		setStatus(STATUS.PENDING);
		socket.emit("create-tour", data);
	}

	return { createTour, status, data, error };
}
