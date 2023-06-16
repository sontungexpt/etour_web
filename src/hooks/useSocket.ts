import { useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

import { API } from "../constant/api";
import useAccessToken from "./useAccessToken";
import { useSelector } from "react-redux";
import { selectSocket, setSocket } from "../features/appSlice";
import { useDispatch } from "react-redux";
import SocketContext from "../contexts/SocketContext";

export default function useSocket(
	onConnect: (socket: Socket) => void,
	dependencies
) {
	const token = useAccessToken();
	const { socket, setSocket } = useContext(SocketContext);

	useEffect(() => {
		if (socket) return;
		let socket_: Socket;
		if (!token) return;
		socket_ = io(`${API.base}`, {
			path: "/socket",
			query: {
				type: "staff",
				token,
			},
		});

		socket_.on("connect", () => {
			setSocket((prev) => {
				if (prev) {
					socket_.disconnect();
					return prev;
				} else return socket_;
			});
		});
	}, [token, ...(dependencies || [])]);

	useEffect(() => {
		if (socket) onConnect?.(socket);
	}, [!!socket]);

	return socket;
}
