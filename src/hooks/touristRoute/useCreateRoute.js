import { useState } from "react";
import useSocket from "../useSocket";
import { STATUS } from "../../constant/status";

export default function useCreateRoute() {
	const [data, setData] = useState(null);
	const [status, setStatus] = useState();
	const [error, setError] = useState(null);

	const socket = useSocket((socket) => {
		// socket.on("retrieve-tourist-route", (data) => {
		// 	setData(data.data);
		// });
		socket.on("create-route-result", (data) => {
			setData(data.data);
			// setStatus(STATUS.SUCCESS);
		});
		socket.on("error", (error) => {
			setError(error);
			// setStatus(STATUS.FAIL);
		});
	}, []);

	function createRoute(newData) {
		setData(null);
		setError(null);
		socket.emit("create-route", newData);
		// setStatus(STATUS.PENDING);
	}

	return { createRoute, status, data, error };
}
