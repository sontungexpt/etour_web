import { useMemo, useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

import usePersistentState from "./usePersistentState";
import { API } from "../constant/api";
import useAccessToken from "./useAccessToken";

export default function useSocket(onConnect: (socket: Socket) => void) {
	const token = useAccessToken();

	useEffect(() => {
		let socket: Socket;
		if (token) {
			socket = io(`${API.base}?token=${token}`, {
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
