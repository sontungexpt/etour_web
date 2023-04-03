import { useState } from "react";
import useSocket from "./useSocket";

export default function useCreateRoute() {
	const [data, setData] = useState([]);
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

	function createRoute({ name, description, type, route }) {
		socket.emit("create-route", { name, description, type, route });
	}

	return { createRoute, routes: data, error };
}
