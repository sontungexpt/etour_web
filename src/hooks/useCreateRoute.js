import { useState } from "react";
import useSocket from "./useSocket";

export default function useCreateRoute() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	const socket = useSocket((socket) => {
		socket.on("retrieve-tourist-route", (data) => {
			setData(data.data);
		});
		socket.on("create-route-result", (data) => {
			setData(data.data);
		});
		socket.on("error", (error) => {
			setError(error);
		});
	}, []);

	function createRoute({
		name,
		reservationFee,
		description,
		type,
		images,
		route,
	}) {
		setData(null);
		setError(null);
		socket.emit("create-route", {
			name,
			reservationFee,
			description,
			type,
			images,
			route,
		});
	}

	return { createRoute, data, error };
}
