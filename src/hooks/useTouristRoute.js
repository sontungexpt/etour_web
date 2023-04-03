import { useState } from "react";
import useSocket from "./useSocket";

export default function useTouristRoute() {
	const [routes, setRoutes] = useState([]);
	const [error, setError] = useState(null);

	useSocket((socket) => {
		socket.emit("view-route");
		socket.on("route", (data) => {
			setRoutes(data.data);
		});
		socket.on("new-route", (data) => {
			setRoutes((prev) => [...prev, data.data]);
		});
		socket.on("error", (error) => {
			setError(error);
		});
	});

	return { data: routes, isError: error !== null, error };
}
