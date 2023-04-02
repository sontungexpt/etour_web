import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routers/mainNavigator";
import { ToastContainer } from "react-toastify";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
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
		</>
	);
}

export default App;
