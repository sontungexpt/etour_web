import { useEffect } from "react";
import { Socket, io } from "socket.io-client";

import { API } from "../constant/api";
import useAccessToken from "./useAccessToken";

export default function useSocket(onConnect: (socket: Socket) => void) {
	const token = useAccessToken();

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
				onConnect?.call?.(null, socket);
			});
		}

		return () => {
			socket?.close();
		};
	}, [token]);
}
