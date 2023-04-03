import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routers/mainNavigator";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./store";

function App() {
	const [count, setCount] = useState(0);

	return (
		<Provider store={store}>
			<RouterProvider router={router} />
			<ToastContainer
				position="top-center"
				autoClose={4000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</Provider>
	);
}

export default App;
