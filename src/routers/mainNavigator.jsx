import { createHashRouter, createBrowserRouter } from "react-router-dom";
import OnBoardingPage from "../pages/OnBoardingPage/OnBoardingPage";
import ENDPOINT from "../constant/endponint";
import HomePage from "../pages/HomePage/HomePage";
import AuthenticationPage from "../pages/AuthenticationPage/AuthenticationPage";
import TourRouteManagementPage from "../pages/TourRouteManagementPage/TourRouteManagementPage";
import BasePage from "../pages/BasePage/BasePage";
import TourManagementPage from "../pages/TourManagementPage/TourManagementPage";
import DetailRoutePage from "../pages/DetailRoutePage/DetailRoutePage";
import VoucherManagementPage from "../pages/VoucherManagementPage/VoucherManagementPage";

export default createHashRouter([
	{
		path: "/",
		element: <BasePage />,
		children: [
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
			{
				path: ENDPOINT.TOURIST_ROUTE,
				element: <TourRouteManagementPage />,
			},
			{
				path: `${ENDPOINT.TOURIST_ROUTE}/:id`,
				element: <DetailRoutePage />,
			},
			{
				path: ENDPOINT.TOUR,
				element: <TourManagementPage />,
			},
			{
				path: ENDPOINT.VOUCHER,
				element: <VoucherManagementPage />,
			},
		],
	},
]);
