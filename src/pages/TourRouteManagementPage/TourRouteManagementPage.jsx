import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AUTHENTICATION_STATE from "../../constant/authenticationState";
import ENDPOINT from "../../constant/endponint";
import { selectBasicInformation } from "../../features/staffSlice";
import useAuthenticationState from "../../hooks/useAuthenticationState";
import { Button } from "@mui/material";
import COLORS from "../../constant/color";
import useStaffInformation from "../../hooks/useStaffInformation";
import useCompanyInformation from "../../hooks/useCompanyInformation";
import CHEVRON from "../../assets/chevron.svg";

import styles from "./TourRouteManagementPage.module.scss";

export default function TourRouteManagementPage() {
	const navigate = useNavigate();

	return <div className={styles.container}></div>;
}
