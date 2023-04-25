import { useState } from "react";
import useSocket from "./useSocket";

export default function useCreateTour() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	const socket = useSocket((socket) => {
		socket.on("create-tour-result", (data) => {
			setData(data.data);
		});
		socket.on("error", (error) => {
			setError(error);
		});
	}, []);

	function createTour({ from, to, type, touristRoute }) {
		setData(null);
		setError(null);
		socket.emit("create-tour", {
			from,
			to,
			type,
			touristRoute,
		});
	}

	return { createTour, data, error };
}
