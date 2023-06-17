import { useEffect, useState } from "react";
import useSocket from "../useSocket";
import { STATUS } from "../../constant/status";

export default function useTourByRouteId(id) {
	const [data, setData] = useState([]);
	const [status, setStatus] = useState();
	const [error, setError] = useState(null);

	useEffect(() => {
		setStatus(STATUS.PENDING);
	}, []);

	useSocket(
		(socket) => {
			socket.emit("filter-tour", { touristRoute: id });
			socket.on("list-tour", (data) => {
				setStatus(STATUS.SUCCESS);
				setData(data.data);
			});
			socket.on("tour", (data) => {
				setStatus(STATUS.UPDATE);
				setData((prev) => [data.data, ...prev]);
			});
			socket.on("error", (error) => {
				setStatus(STATUS.FAIL);
				setError(error);
			});
		},
		[id]
	);

	return { data, status, isError: error !== null, error };
}
