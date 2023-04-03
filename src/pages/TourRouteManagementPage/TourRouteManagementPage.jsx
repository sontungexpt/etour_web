import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Chip } from "@mui/material";
import CHEVRON from "../../assets/chevron-down.svg";
import CLOSE from "../../assets/close.svg";
import SEARCH from "../../assets/search.svg";
import ROUTE from "../../assets/taxi.svg";
import COLORS from "../../constant/color";

import { toast } from "react-toastify";
import usePersistentState from "../../hooks/usePersistentState";
import useTouristRoute from "../../hooks/useTouristRoute";
import styles from "./TourRouteManagementPage.module.scss";

export default function TourRouteManagementPage() {
	const navigate = useNavigate();

	const searchRef = useRef();
	const [searchValue, setSearchValue] = usePersistentState(
		"tour-route-search",
		""
	);
	const { data, isError, error } = useTouristRoute({
		route: [],
		keyword: searchValue,
	});

	useEffect(() => {
		if (isError) {
			toast(`An error occur when retrieve tourist route: ${error.message}`);
		}
	}, [isError]);

	return (
		<div className={styles.container}>
			<h1>Manage tourist route</h1>
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
			<div className={styles.command}>
				<div className={styles.search}>
					<input
						ref={searchRef}
						onKeyDown={(e) => {
							if (e.key === "Enter")
								setSearchValue(searchRef.current.value);
						}}
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
								className={styles.close}
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
				<div className={styles.table}>
					<div className={styles.line}>
						<p>Name</p>
						<p>Route</p>
						<p>Reservation fee</p>
						<p>Customers</p>
					</div>
					{data?.map(({ name, reservationFee, route, _id }, index) => (
						<>
							<hr />
							<div
								onClick={() => {
									navigate(_id);
								}}
								className={styles.line}
							>
								<p>{name}</p>
								<p>{route.join(" - ")}</p>
								<p>{reservationFee}</p>
								<p>{Math.floor(Math.random(100))}</p>
							</div>
						</>
					))}
				</div>
			</div>
		</div>
	);
}
