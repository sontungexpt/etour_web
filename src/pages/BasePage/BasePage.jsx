import { selectLoginState, setBasicInformation } from '@/features/staffSlice';
import useAuthenticationNavigate from '@/hooks/useAuthenticationNavigate';
import useStaffInformation from '@/hooks/staff/useStaffInformation';
import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Loading from '@/components/Loading/Loading';
import NavigationBar from '@/components/NavigationBar/NavigationBar';
import RegisteringCompany from '@/components/RegisteringCompany/RegisteringCompany';
import { STATUS } from '@/constant/status';
import SocketContext from '@/contexts/SocketContext';
import { setGetListTouristRouteError, setRoutes } from '@/features/touristRouteSlice';
import useTouristRoute from '@/hooks/touristRoute/useTouristRoute';
import useCallAPIToast from '@/hooks/useCallAPIToast';
import useCompanyInformation from '@/hooks/useCompanyInformation';
import { useSelector } from 'react-redux';
import { isPathNameInNeedToAuthPage } from '../../constant/need-to-auth-page';
import styles from './BasePage.module.scss';

export default function BasePage() {
    const location = useLocation();
    const { socket, socketStatus, setSocketStatus } = useContext(SocketContext);
    const navigate = useNavigate();
    useAuthenticationNavigate();

    const dispatch = useDispatch();
    const { data, error } = useStaffInformation();
    const { data: companyData, isError } = useCompanyInformation();

    useEffect(() => {
        if (data)
            dispatch(
                setBasicInformation({
                    staff: data,
                })
            );
    }, [data]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (companyData || isError) {
            setLoading(false);
        }
    }, [isError, companyData]);

    const isLoggedIn = useSelector(selectLoginState);

    useEffect(() => {
        if (socket) {
            setSocketStatus(STATUS.SUCCESS);
        } else {
            if (isPathNameInNeedToAuthPage({ pathname: location.pathname }) && !isLoggedIn) {
                setLoading(false);
            }
        }
    }, [socket, location.pathname]);

    useCallAPIToast({
        status: socketStatus,
        message: {
            pending: 'Connecting to service...',
            success: 'Connect to service successfully',
            fail: 'Fail to connect to server',
        },
    });

    const { data: routes, error: routeError } = useTouristRoute({
        route: [],
        keyword: '',
    });
    useEffect(() => {
        dispatch(setRoutes(routes));
        dispatch(setGetListTouristRouteError({ error: routeError }));
    }, [routes, routeError]);

    if (
        !isLoggedIn &&
        !isPathNameInNeedToAuthPage({
            pathname: location.pathname,
        })
    ) {
        return <Loading />;
    }

    if (
        companyData &&
        !companyData.isApproveToActive &&
        isLoggedIn &&
        !isPathNameInNeedToAuthPage({
            pathname: location.pathname,
        })
    ) {
        return <RegisteringCompany />;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={styles.container}>
            <NavigationBar />
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}
