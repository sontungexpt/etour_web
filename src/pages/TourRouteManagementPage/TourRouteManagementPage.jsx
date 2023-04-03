import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import AUTHENTICATION_STATE from "../../constant/authenticationState";
import ENDPOINT from "../../constant/endponint";
import { selectBasicInformation } from "../../features/staffSlice";
import useAuthenticationState from "../../hooks/useAuthenticationState";
import { Button } from "@mui/material";
import COLORS from "../../constant/color";
import useStaffInformation from "../../hooks/useStaffInformation";
import useCompanyInformation from "../../hooks/useCompanyInformation";
import CHEVRON from "../../assets/chevron-down.svg";
import SEARCH from "../../assets/search.svg";
import ROUTE from "../../assets/taxi.svg";
import CLOSE from "../../assets/close.svg";

import styles from "./TourRouteManagementPage.module.scss";
import usePersistentState from "../../hooks/usePersistentState";
import useTouristRoute from "../../hooks/useTouristRoute";

export default function TourRouteManagementPage() {
	const navigate = useNavigate();

	const searchRef = useRef();
	const [searchValue, setSearchValue] = usePersistentState(
		"tour-route-search",
		""
	);
	const routes = useTouristRoute();
	console.log({ routes });

	return (
		<div className={styles.container}>
			<h1>Manage tourist route</h1>
			<div className={styles.command}>
				<div className={styles.search}>
					<input
						ref={searchRef}
						type="text"
						placeholder="Find tour by name..."
					/>
					<Button
						onClick={() => setSearchValue(searchRef.current.value)}
						variant="contained"
						sx={{
							backgroundColor: COLORS.primary,
							borderRadius: "8px",
							height: "40px",
							width: "200px",
						}}
					>
						<p>Search</p>
					</Button>
				</div>
				<div className={styles.filter}>
					{searchValue ? (
						<div className={styles.item}>
							<img src={SEARCH} alt="" />
							<p>{searchValue}</p>
							<img
								className={styles.clickable}
								onClick={() => {
									searchRef.current.value = "";
									setSearchValue("");
								}}
								src={CLOSE}
								alt=""
							/>
						</div>
					) : null}
					<div className={styles.item}>
						<img src={ROUTE} alt="" />
						<p>Filter route</p>
						<img className={styles.clickable} src={CHEVRON} alt="" />
					</div>
				</div>
			</div>

			<div className={styles.data}>
				<Button
					variant="outlined"
					sx={{
						borderRadius: "8px",
						padding: "8px",
						width: "100%",
					}}
				>
					<p className={styles.create}>Create new tourist route</p>
				</Button>
			</div>
		</div>
	);
}
