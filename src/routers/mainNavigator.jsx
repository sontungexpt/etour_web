import { createBrowserRouter } from 'react-router-dom';
import ENDPOINT from '@/constant/endponint';
import AuthenticationPage from '@/pages/AuthenticationPage/AuthenticationPage';
import BasePage from '@/pages/BasePage/BasePage';
import DetailRoutePage from '@/pages/DetailRoutePage/DetailRoutePage';
import HomePage from '@/pages/HomePage/HomePage';
import OnBoardingPage from '@/pages/OnBoardingPage/OnBoardingPage';
import TourManagementPage from '@/pages/TourManagementPage/TourManagementPage';
import TourRouteManagementPage from '@/pages/TourRouteManagementPage/TourRouteManagementPage';
import VoucherManagementPage from '@/pages/VoucherManagementPage/VoucherManagementPage';
import DetailTourPage from '@/pages/DetailTourPage/DetailTourPage';
import RegisterPage from '@/pages/RegisterPage/RegisterPage';
import ValidateCompanyPage from '@/pages/ValidateCompanyPage/ValidateCompanyPage';
import ChatPage from '@/pages/ChatPage/ChatPage';
import DetailChatPage from '@/pages/DetailChatPage/DetailChatPage';
import ErrorPage from '@/pages/ErrorPage/ErrorPage';

export default createBrowserRouter([
    {
        path: '/',
        element: <BasePage />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: ENDPOINT.ON_BOARDING,
                element: <OnBoardingPage />,
            },
            {
                path: ENDPOINT.REGISTER,
                element: <RegisterPage />,
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
                path: ENDPOINT.VALIDATE_COMPANY,
                element: <ValidateCompanyPage />,
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
            {
                path: '/chat',
                element: <DetailChatPage />,
            },
            {
                path: `${ENDPOINT.CHAT}/:id`,
                element: <DetailChatPage />,
            },
            {
                path: '*',
                element: <div>404</div>,
            },
        ],
    },
]);
