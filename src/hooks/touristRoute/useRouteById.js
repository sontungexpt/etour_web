import { useState } from "react";
import useSocket from "../useSocket";

export default function useRouteById(id) {
	const [route, setRoute] = useState(null);
	const [error, setError] = useState(null);

	useSocket(
		(socket) => {
			socket.emit("view-route", { id });
			socket.on("route", (data) => {
				setRoute(data.data);
			});
			socket.on("error", (error) => {
				setError(error);
			});
		},
		[id]
	);

	return { data: route, isError: error !== null, error };
}
