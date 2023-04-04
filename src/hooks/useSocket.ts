import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

import { API } from "../constant/api";
import useAccessToken from "./useAccessToken";

export default function useSocket(
	onConnect: (socket: Socket) => void,
	dependencies
) {
	const token = useAccessToken();
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {
		let socket: Socket;
		if (token) {
			socket = io(`${API.base}`, {
				path: "/socket",
				query: {
					type: "staff",
					token,
				},
			});

			socket.on("connect", () => {
				setSocket(socket);
				onConnect?.call?.(null, socket);
			});
		}

		return () => {
			socket?.close();
		};
	}, [token, ...(dependencies || [])]);

	return socket;
}
