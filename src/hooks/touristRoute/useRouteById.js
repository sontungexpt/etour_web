import { useEffect, useState } from "react";
import useSocket from "../useSocket";
import { STATUS } from "../../constant/status";

export default function useRouteById(id) {
	const [route, setRoute] = useState(null);
	const [status, setStatus] = useState();
	const [error, setError] = useState(null);

	useEffect(() => {
		setStatus(STATUS.PENDING);
	}, []);

	useEffect(() => {
		if (status == STATUS.UPDATE) setStatus("");
		if (status == STATUS.SUCCESS) setStatus("");
	}, [status]);

	useSocket(
		(socket) => {
			socket.emit("view-route", { id });
			socket.on("route", (data) => {
				setStatus((prev) => (prev == "" ? STATUS.UPDATE : STATUS.SUCCESS));
				setRoute(data.data);
			});
			socket.on("error", (error) => {
				setStatus(STATUS.FAIL);
				setError(error);
			});
		},
		[id]
	);

	return { data: route, status, isError: error !== null, error };
}
