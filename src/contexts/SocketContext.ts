import { createContext } from "react";

const SocketContext = createContext({
	socket: null,
	setSocket: (newSocket: any) => {},
});

export default SocketContext;
