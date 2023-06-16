import { useState } from "react";
import useSocket from "../useSocket";
import { STATUS } from "../../constant/status";

export default function useChangeRoute() {
	const [data, setData] = useState(null);
	const [status, setStatus] = useState();
	const [error, setError] = useState(null);

	const socket = useSocket((socket) => {
		socket.on("edit-route-result", (data) => {
			console.log({ data });
			setData(data.data);
			setStatus(STATUS.SUCCESS);
		});
		socket.on("error", (error) => {
			setError(error);
			setStatus(STATUS.FAIL);
		});
	}, []);

	function changeRoute(newData) {
		setData(null);
		setError(null);
		socket.emit("edit-route", newData);
		setStatus(STATUS.PENDING);
	}

	return { changeRoute, status, data, error };
}
