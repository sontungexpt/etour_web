import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
	Button,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import COLORS from "../../constant/color";

import { toast } from "react-toastify";
import CenteredModal from "../../components/CenteredModal/CenteredModal";
import useCreateTour from "../../hooks/useCreateTour";
import usePersistentState from "../../hooks/usePersistentState";
import useRouteById from "../../hooks/useRouteById";
import useTourByRouteId from "../../hooks/useTourByRouteId";
import useTouristRoute from "../../hooks/useTouristRoute";
import styles from "./DetailRoutePage.module.scss";
import { API_ENDPOINT } from "../../constant/api";

export default function DetailRoutePage() {
	const navigate = useNavigate();
	const {
		createTour,
		data: createdData,
		error: createdError,
	} = useCreateTour();

	const { id } = useParams();
	const {
		data: routeInformation,
		isError: isRouteInformationError,
		error: routeInformationError,
	} = useRouteById(id);

	const {
		data: tours,
		isError: isRetrieveTourError,
		error: retrieveTourError,
	} = useTourByRouteId(id);

	useEffect(() => {
		console.log({ tours, routeInformation });
	}, [id, tours, !routeInformation]);

	const searchRef = useRef();
	const [searchValue, setSearchValue] = usePersistentState(
		"tour-route-search",
		""
	);

	const [tourName, setTourName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());
	const [type, setType] = useState("normal");

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

	useEffect(() => {
		if (createdError)
			toast.error(`Fail to create tourist route: ${createdError.message}`);
	}, [createdError]);

	useEffect(() => {
		if (createdData) {
			toast.success(`Successfully create tour`);
		}
	}, [createdData]);

	function handleSubmit() {
		setIsOpenCreateBox(false);
		const data = {
			name: tourName,
			description,
			from,
			to,
			price,
			type,
			touristRoute: id,
		};
		createTour(data);
	}

	return (
		<>
			<div className={styles.container}>
				<div>
					<h1>{routeInformation?.name}</h1>
					<p>{routeInformation?.description}</p>
					<p>
						Reservation fee:{" "}
						<span>{routeInformation?.reservationFee}</span>
					</p>
					<p>Route: {routeInformation?.route?.join(" - ")} </p>
				</div>
				<div className={styles.imagePreview}>
					{routeInformation?.images?.map((image) => (
						<img src={`${API_ENDPOINT.IMAGE}/${image}`} />
					))}
				</div>
				<Button
					onClick={() => setIsOpenCreateBox(true)}
					variant="outlined"
					sx={{
						borderRadius: "8px",
						padding: "8px",
						width: "100%",
					}}
				>
					<p className={styles.create}>Create new tour</p>
				</Button>
				<div className={styles.data}>
					<div className={styles.table}>
						<div className={styles.line}>
							<p>Name</p>
							<p>From</p>
							<p>Type</p>
							<p>Customers</p>
						</div>
						{tours?.map?.(({ from, name, type }, index) => (
							<div key={index}>
								<hr />
								<div
									onClick={() => {
										navigate(_id);
									}}
									className={styles.line}
								>
									<p>{name}</p>
									<p>
										{new Intl.DateTimeFormat("en-GB", {
											dateStyle: "full",
											timeStyle: "short",
											timeZone: "Asia/Ho_Chi_Minh",
										}).format(new Date(from))}
									</p>
									<p>{type}</p>
									<p>{0}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<CenteredModal
				isOpen={isOpenCreateBox}
				onClose={() => setIsOpenCreateBox(false)}
			>
				<div className={styles.createBox}>
					<h1>Create new tour</h1>
					<div className={styles.form}>
						<TextField
							value={tourName}
							onChange={(e) => setTourName(e.target.value)}
							label="Tour name"
							variant="standard"
						/>
						<TextField
							value={price}
							onChange={(e) => setPrice(parseInt(e.target.value))}
							type="number"
							label="Price"
							variant="standard"
						/>
						<TextField
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							label="Description"
							variant="standard"
						/>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								label="From"
								onChange={(d) => setFrom(new Date(d.$d))}
							/>
							<DatePicker
								label="To"
								onChange={(d) => setTo(new Date(d.$d))}
							/>
						</LocalizationProvider>
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
							<FormHelperText>Normal nè</FormHelperText>
							<FormHelperText>Promotion nè</FormHelperText>
						</FormControl>
					</div>
					<Button
						onClick={handleSubmit}
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
