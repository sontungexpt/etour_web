import { createBrowserRouter } from "react-router-dom";
import ENDPOINT from "../constant/endponint";
import AuthenticationPage from "../pages/AuthenticationPage/AuthenticationPage";
import BasePage from "../pages/BasePage/BasePage";
import DetailRoutePage from "../pages/DetailRoutePage/DetailRoutePage";
import HomePage from "../pages/HomePage/HomePage";
import OnBoardingPage from "../pages/OnBoardingPage/OnBoardingPage";
import TourManagementPage from "../pages/TourManagementPage/TourManagementPage";
import TourRouteManagementPage from "../pages/TourRouteManagementPage/TourRouteManagementPage";
import VoucherManagementPage from "../pages/VoucherManagementPage/VoucherManagementPage";
import DetailTourPage from "../pages/DetailTourPage/DetailTourPage";

export default createBrowserRouter([
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
			{
				path: `${ENDPOINT.TOUR}/:id`,
				element: <DetailTourPage />,
			},
		],
	},
]);
