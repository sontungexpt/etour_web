import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	Button,
	Chip,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import CHEVRON from "../../assets/chevron-down.svg";
import CLOSE from "../../assets/close.svg";
import SEARCH from "../../assets/search.svg";
import ROUTE from "../../assets/taxi.svg";
import COLORS from "../../constant/color";

import { toast } from "react-toastify";
import usePersistentState from "../../hooks/usePersistentState";
import useTouristRoute from "../../hooks/useTouristRoute";
import styles from "./TourRouteManagementPage.module.scss";
import CenteredModal from "../../components/CenteredModal/CenteredModal";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import RouteList from "../../components/RouteList/RouteList";

export default function TourRouteManagementPage() {
	const navigate = useNavigate();

	const searchRef = useRef();
	const [searchValue, setSearchValue] = usePersistentState(
		"tour-route-search",
		""
	);

	const [routeName, setRouteName] = useState("");
	const [reservationFee, setReservationFee] = useState(0);
	const [description, setDescription] = useState("");
	const [type, setType] = useState("");

	const [isOpenCreateBox, setIsOpenCreateBox] = useState(false);

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
		<>
			<div className={styles.container}>
				<h1>Manage tourist route</h1>
				<Button
					onClick={() => setIsOpenCreateBox(true)}
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
							<div key={index}>
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
							</div>
						))}
					</div>
				</div>{" "}
			</div>
			<CenteredModal
				isOpen={isOpenCreateBox}
				onClose={() => setIsOpenCreateBox(false)}
			>
				<div className={styles.createBox}>
					<h1>Create new route</h1>
					<div className={styles.form}>
						<TextField
							value={routeName}
							onChange={(e) => setRouteName(e.target.value)}
							label="Route name"
							variant="standard"
						/>
						<TextField
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							label="Description"
							multiline
							variant="standard"
						/>
						<TextField
							error={!Number.isInteger(parseInt(reservationFee))}
							value={reservationFee}
							onChange={(e) => setReservationFee(e.target.value)}
							label="Reservation fee"
							helperText="Reservation fee must be a integer"
							variant="standard"
						/>
						<FormControl sx={{ mt: 2, minWidth: 120 }}>
							<InputLabel id="demo-simple-select-helper-label">
								Type
							</InputLabel>
							<Select
								labelId="demo-simple-select-helper-label"
								id="demo-simple-select-helper"
								label="Age"
								value={type}
								onChange={(e) => setType(e.target.value)}
							>
								<MenuItem value={"normal"}>Normal</MenuItem>
								<MenuItem value={"promotion"}>Promotion</MenuItem>
							</Select>
							<FormHelperText>
								Chuyến du lịch thông thường : Với giá vé thông thường
								(chung cho du khách trong hay ngoài nước). Khi trả vé,
								ngoài khoản lệ phí hoàn vé trễ (nếu có), du khách được
								hoàn trả 100% giá vé đã mua.
							</FormHelperText>
							<FormHelperText>
								Chuyến du lịch có khuyến mãi : Với giá vé khuyến mãi
								thấp hơn mức giá thông thường (chung cho du khách trong
								hay ngoài nước). Khi trả vé, ngoài khoản lệ phí hoàn vé
								trễ (nếu có), du khách được hoàn trả 80% giá vé khuyến
								mãi đã mua
							</FormHelperText>
						</FormControl>
						<h2>Tourist route</h2>
					</div>
					<RouteList />
					<Button
						onClick={() => setSearchValue(searchRef.current.value)}
						variant="contained"
						sx={{
							backgroundColor: COLORS.primary,
							borderRadius: "8px",
							height: "40px",
							width: "100%",
						}}
					>
						<p className={styles.buttonText}>Submit</p>
					</Button>
				</div>
			</CenteredModal>
		</>
	);
}
