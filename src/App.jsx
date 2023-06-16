import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import router from "./routers/mainNavigator";
import store from "./store";
import SocketContext from "./contexts/SocketContext";
import { useState } from "react";

function App() {
	const [socket, setSocket] = useState();

	return (
		<SocketContext.Provider value={{ socket, setSocket }}>
			<Provider store={store}>
				<RouterProvider router={router} />
				<ToastContainer
					position="top-center"
					autoClose={4000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
			</Provider>
		</SocketContext.Provider>
	);
}

export default App;
