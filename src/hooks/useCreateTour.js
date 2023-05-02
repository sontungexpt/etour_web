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

	function createTour(data) {
		setData(null);
		setError(null);
		socket.emit("create-tour", data);
	}

	return { createTour, data, error };
}
