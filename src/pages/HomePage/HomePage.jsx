import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";
import { toast } from "react-toastify";
import CHEVRON from "../../assets/chevron.svg";
import AUTHENTICATION_STATE from "../../constant/authenticationState";
import COLORS from "../../constant/color";
import ENDPOINT from "../../constant/endponint";
import useAuthenticationState from "../../hooks/useAuthenticationState";
import useCompanyInformation from "../../hooks/useCompanyInformation";
import useStaffInformation from "../../hooks/useStaffInformation";
import styles from "./HomePage.module.scss";
import { setBasicInformation } from "../../features/staffSlice";
import Card from "../../components/Card/Card";
import ImageButton from "../../components/ImageButton/ImageButton";

import { ReactComponent as SIGN_OUT_ICON } from "../../assets/sign-out.svg";
import { ReactComponent as EDIT_ICON } from "../../assets/edit.svg";

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
				<h1>Hello {data?.fullName}, welcome to E-Tour Business</h1>
				<div className={styles.dashboard}>
					<div className={styles.information}>
						<Card backgroundColor="white">
							<div className={styles.box}>
								<h2>Staff information</h2>
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
								<div className={styles.functionBox}>
									<ImageButton
										onClick={() => {}}
										icon={EDIT_ICON}
										backgroundColor={COLORS.editBackground}
										color={COLORS.edit}
									>
										Edit profile
									</ImageButton>
									<ImageButton
										onClick={() => {
											localStorage.removeItem("accessToken");
											localStorage.removeItem("refresshToken");
											navigate(ENDPOINT.ON_BOARDING);
											toast("Sign out successfully");
										}}
										icon={SIGN_OUT_ICON}
										backgroundColor={COLORS.deleteBackground}
										color={COLORS.delete}
									>
										Sign out
									</ImageButton>
								</div>
							</div>
						</Card>
						<Card backgroundColor="white">
							<div className={styles.box}>
								<h2>Company information</h2>
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
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
