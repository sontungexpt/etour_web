import { useLocation, useNavigate } from "react-router-dom";
import useAuthenticationState from "./useAuthenticationState";
import AUTHENTICATION_STATE from "../constant/authenticationState";
import ENDPOINT from "../constant/endponint";
import { useEffect } from "react";

export default function useAuthenticationNavigate() {
	const navigate = useNavigate();
	const location = useLocation();
	const authenticationState = useAuthenticationState();

	useEffect(() => {
		if (authenticationState == AUTHENTICATION_STATE.UNAUTHENTICATED) {
			if (location.pathname != ENDPOINT.ON_BOARDING)
				navigate(ENDPOINT.ON_BOARDING);
		}
	}, []);
}
