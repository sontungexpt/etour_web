import { createHashRouter } from "react-router-dom";
import OnBoardingPage from "../pages/OnBoardingPage/OnBoardingPage";
import ENDPOINT from "../constant/endponint";
import HomePage from "../pages/HomePage/HomePage";
import AuthenticationPage from "../pages/AuthenticationPage/AuthenticationPage";

export default createHashRouter([
	{
		path: ENDPOINT.ON_BOARDING,
		element: <OnBoardingPage />,
	},
	{
		path: ENDPOINT.HOME,
		element: <HomePage />,
	},
	{
		path: ENDPOINT.AUTHENTICATION,
		element: <AuthenticationPage />,
	},
]);
