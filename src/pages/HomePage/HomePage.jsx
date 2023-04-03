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
import { toast } from "react-toastify";

export default function HomePage() {
	const navigate = useNavigate();
	const authenticationState = useAuthenticationState();

	const { data, isError, error } = useStaffInformation();
	const {
		data: companyData,
		companyIsError,
		companyError,
	} = useCompanyInformation();

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
							<div className={styles.staffBasicInfo}>
								<img src="" alt="" />
								<div>
									<p>{data?.fullName}</p>
									<p>{data?.role}</p>
								</div>
							</div>
							<div className={styles.permission}>
								<p>Permissions</p>
								<ul>
									{data?.permissions?.map((permission) => (
										<li>{permission}</li>
									))}
								</ul>
							</div>
							<Button
								onClick={() => {
									localStorage.removeItem("accessToken");
									localStorage.removeItem("refresshToken");
									navigate(ENDPOINT.ON_BOARDING);
									toast("Sign out successfully");
								}}
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
						<div className={styles.box}>
							<div className={styles.staffBasicInfo}>
								<img src="" alt="" />
								<div>
									<p>{companyData?.name}</p>
								</div>
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
								<p className={styles.signout}>Edit company</p>
							</Button>
						</div>
					</div>
					<div className={styles.function}>
						<div
							onClick={() => navigate(ENDPOINT.TOURIST_ROUTE)}
							className={styles.item}
						>
							<p>Manage tourist route</p>
							<img src={CHEVRON} alt="" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
