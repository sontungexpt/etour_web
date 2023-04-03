
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AUTHENTICATION_STATE from "../../constant/authenticationState";
import ENDPOINT from "../../constant/endponint";
import { selectBasicInformation } from "../../features/staffSlice";
import useAuthenticationState from "../../hooks/useAuthenticationState";
import styles from "./HomePage.module.scss";
import { Button } from "@mui/material";
import COLORS from "../../constant/color";
import useStaffInformation from "../../hooks/useStaffInformation";
import useCompanyInformation from "../../hooks/useCompanyInformation";
import CHEVRON from "../../assets/chevron.svg";

export default function TourRouteManagementPage() {
	const navigate = useNavigate();
	const authenticationState = useAuthenticationState();

	useEffect(() => {
		if (authenticationState == AUTHENTICATION_STATE.UNAUTHENTICATED)
			navigate(ENDPOINT.ON_BOARDING);
	}, []);

	return (
		<div className={styles.container}>
			
		</div>
	);
}
