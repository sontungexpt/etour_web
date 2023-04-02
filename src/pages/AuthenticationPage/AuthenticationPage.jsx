import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.scss";
import { useEffect } from "react";
import ENDPOINT from "../../constant/endponint";
import useAuthenticationState from "../../hooks/useAuthenticationState";
import AUTHENTICATION_STATE from "../../constant/authenticationState";

export default function AuthenticationPage() {
	const navigate = useNavigate();
	const authenticationState = useAuthenticationState();

	useEffect(() => {
		if (authenticationState == AUTHENTICATION_STATE.AUTHENTICATED)
			navigate(ENDPOINT.HOME);
	}, []);

	return <div className={styles.container}></div>;
}
