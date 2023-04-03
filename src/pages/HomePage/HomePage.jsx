import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import AUTHENTICATION_STATE from "../../constant/authenticationState";
import ENDPOINT from "../../constant/endponint";
import { selectBasicInformation } from "../../features/staffSlice";
import useAuthenticationState from "../../hooks/useAuthenticationState";
import styles from "./HomePage.module.scss";
import { Button } from "@mui/material";
import COLORS from "../../constant/color";

export default function HomePage() {
	const navigate = useNavigate();
	const authenticationState = useAuthenticationState();

	// const staffInformation = useSelector(selectBasicInformation);

	useEffect(() => {
		if (authenticationState == AUTHENTICATION_STATE.UNAUTHENTICATED)
			navigate(ENDPOINT.ON_BOARDING);
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<h1>Hello, welcome to E-Tour Business</h1>
				<div className={styles.dashboard}>
					<div className={styles.information}>
						<div className={styles.box}>
							<div>
								<img src="" alt="" />
								<div>
									<p></p>
									<p></p>
								</div>
							</div>
							<div>
								<p></p>
								<ul></ul>
							</div>
							<Button
								variant="contained"
								sx={{
									width: "100%",
									backgroundColor: COLORS.primary,
									borderRadius: "8px",
									padding: "8px",
								}}
							>
								<p className={styles.signout}>Sign out</p>
							</Button>
						</div>
					</div>
					<div className={styles.function}></div>
				</div>
			</div>
		</div>
	);
}
