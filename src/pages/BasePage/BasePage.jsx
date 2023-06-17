import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { setBasicInformation } from "../../features/staffSlice";
import useAuthenticationNavigate from "../../hooks/useAuthenticationNavigate";
import useStaffInformation from "../../hooks/useStaffInformation";

import LOGO from "../../assets/logo.svg";
import { ReactComponent as Route } from "../../assets/route.svg";
import { ReactComponent as Tour } from "../../assets/tour.svg";
import { ReactComponent as HOME } from "../../assets/home.svg";

import ENDPOINT from "../../constant/endponint";
import styles from "./BasePage.module.scss";
import NavigationButton from "../../components/NavigationButton/NavigationButton";
import {
	setRoutes,
	setGetListTouristRouteError,
} from "../../features/touristRouteSlice";
import useTouristRoute from "../../hooks/touristRoute/useTouristRoute";

export default function BasePage() {
	console.log("debug");
	const location = useLocation();
	const navigate = useNavigate();
	useAuthenticationNavigate();

	const dispatch = useDispatch();
	const { data, isError, error } = useStaffInformation();

	useEffect(() => {
		if (data) dispatch(setBasicInformation(data));
	}, [data]);

	const { data: routes, error: routeError } = useTouristRoute({
		route: [],
		keyword: "",
	});
	useEffect(() => {
		dispatch(setRoutes(routes));
		dispatch(setGetListTouristRouteError({ error: routeError }));
	}, [routes, routeError]);

	return (
		<div className={styles.container}>
			{location.pathname == ENDPOINT.AUTHENTICATION ||
			location.pathname == ENDPOINT.ON_BOARDING ? null : (
				<div className={styles.drawer}>
					<button
						type="button"
						className={styles.logo}
						onClick={() => navigate(ENDPOINT.HOME)}
					>
						<img src={LOGO} alt="" />
					</button>
					<div className={styles.navButtonGroup}>
						<NavigationButton
							onClick={() => navigate(ENDPOINT.HOME)}
							isHighlighted={location.pathname == ENDPOINT.HOME}
							icon={HOME}
						>
							Home
						</NavigationButton>
						<NavigationButton
							onClick={() => navigate(ENDPOINT.TOURIST_ROUTE)}
							isHighlighted={location.pathname == ENDPOINT.TOURIST_ROUTE}
							icon={Route}
						>
							Tourist route
						</NavigationButton>
						<NavigationButton
							onClick={() => navigate(ENDPOINT.TOUR)}
							isHighlighted={location.pathname == ENDPOINT.TOUR}
							icon={Tour}
						>
							Tour
						</NavigationButton>
					</div>
				</div>
			)}
			<div className={styles.content}>
				<Outlet />
			</div>
		</div>
	);
}
