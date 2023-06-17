import { useState } from "react";
import useSocket from "../useSocket";

export default function useTourByRouteId(id) {
	const [routes, setRoutes] = useState([]);
	const [error, setError] = useState(null);

	useSocket(
		(socket) => {
			socket.emit("filter-tour", { touristRoute: id });
			socket.on("list-tour", (data) => {
				setRoutes(data.data);
			});
			socket.on("tour", (data) => {
				console.log({ data });
				setRoutes((prev) => [data.data, ...prev]);
			});
			socket.on("error", (error) => {
				setError(error);
			});
		},
		[id]
	);

	return { data: routes, isError: error !== null, error };
}
