import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	Button,
	FormControl,
	FormHelperText,
	Input,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import COLORS from "../../constant/color";

import { toast } from "react-toastify";
import CenteredModal from "../../components/CenteredModal/CenteredModal";
import ImageButton from "../../components/ImageButton/ImageButton";
import RouteList from "../../components/RouteList/RouteList";
import useCreateRoute from "../../hooks/useCreateRoute";
import usePersistentState from "../../hooks/usePersistentState";
import styles from "./TourRouteManagementPage.module.scss";

import { ReactComponent as ADD_ICON } from "../../assets/add.svg";
import { ReactComponent as DELETE_ICON } from "../../assets/delete.svg";
import { ReactComponent as EDIT_ICON } from "../../assets/edit.svg";

import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteTouristRoutes,
	selectDeleteStatus,
	selectGetListTouristRoutesError,
	selectRoutes,
	setDeleteTouristRouteStatus,
} from "../../features/touristRouteSlice";
import { STATUS } from "../../constant/status";
import useCallAPIToast from "../../hooks/useCallAPIToast";

const columns = [
	{
		field: "_id",
		headerName: "ID",
		width: 250,
	},
	{
		field: "name",
		headerName: "Tourist route name",
		width: 300,
	},
	{
		field: "type",
		headerName: "Type",
		width: 120,
	},
	{
		field: "reservationFee",
		headerName: "Reservation Fee",
		width: 150,
	},
	{
		field: "route",
		headerName: "Route",
		valueGetter: (param) => param.row.route.join(" - "),
		width: 250,
	},
	{
		field: "createdAt",
		headerName: "Created at",
		width: 280,
		valueGetter: (param) =>
			moment(param.row.createdAt).format("DD MMMM YYYY, h:mm:ss a"),
	},
];

export default function TourRouteManagementPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [selectedIDs, setSelectedIDs] = useState([]);

	const {
		createRoute,
		data: createdData,
		error: createdError,
	} = useCreateRoute();

	// const searchRef = useRef();
	// const [searchValue, setSearchValue] = usePersistentState(
	// 	"tour-route-search",
	// 	""
	// );

	const [routeName, setRouteName] = useState("");
	const [reservationFee, setReservationFee] = useState(0);
	const [description, setDescription] = useState("");
	const [images, setImages] = useState([]);
	const [type, setType] = useState("");
	const [route, setRoute] = useState([]);

	const [isOpenCreateBox, setIsOpenCreateBox] = useState(false);

	const data = useSelector(selectRoutes);
	const { isError, createError: error } = useSelector(
		selectGetListTouristRoutesError
	);
	const deleteStatus = useSelector(selectDeleteStatus);

	useCallAPIToast({
		status: deleteStatus,
		message: {
			pending: "Deleting...",
			success: "Delete tourist route successfully",
			fail: "Fail to delete tourist route",
		},
		onResponse: () => {
			setSelectedIDs([]);
			dispatch(setDeleteTouristRouteStatus(""));
		},
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
		if (createdData) toast.success("Successfully create route");
	}, [createdData]);

	async function handleSubmit() {
		setIsOpenCreateBox(false);

		const data = {
			name: routeName,
			description,
			reservationFee,
			type,
			images: await Promise.all(
				Array(images.length)
					.fill("")
					.map(async (_, index) => ({
						originalname: images[index].name,
						buffer: await images[index].arrayBuffer(),
					}))
			),
			route: route.map(({ content }) => content),
		};

		createRoute(data);
	}

	return (
		<>
			<div className={styles.container}>
				<h1>Manage tourist route</h1>
				<div className={styles.buttonGroup}>
					<ImageButton
						icon={ADD_ICON}
						color={COLORS.edit}
						backgroundColor={COLORS.editBackground}
						onClick={() => setIsOpenCreateBox(true)}
					>
						Create new tourist route
					</ImageButton>
					<ImageButton
						icon={EDIT_ICON}
						color={COLORS.edit}
						backgroundColor={COLORS.editBackground}
						disabled={selectedIDs.length != 1}
						onClick={() => {
							navigate(selectedIDs[0]);
						}}
					>
						Edit
					</ImageButton>
					<ImageButton
						icon={DELETE_ICON}
						color={COLORS.delete}
						backgroundColor={COLORS.deleteBackground}
						disabled={selectedIDs.length == 0}
						onClick={() => {
							dispatch(deleteTouristRoutes(selectedIDs));
						}}
					>
						Delete
					</ImageButton>
				</div>
				<div className={styles.data}>
					<DataGrid
						rows={data || []}
						columns={columns}
						getRowId={(row) => row._id}
						checkboxSelection
						onCellClick={({ row }) => {
							const id = row._id;
							if (selectedIDs.includes(id))
								setSelectedIDs((prev) => [
									...prev.filter((d) => d != id),
								]);
							else setSelectedIDs((prev) => [...prev, id]);
						}}
						onColumnHeaderClick={({ field }) => {
							if (field == "__check__")
								if (selectedIDs.length == 0)
									setSelectedIDs(data.map((row) => row._id));
								else setSelectedIDs([]);
						}}
					/>
				</div>
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
						<div className={styles.imagePreview}>
							{Array(images.length)
								.fill("")
								.map?.((_, i) => (
									<img src={URL.createObjectURL(images[i])} />
								))}
						</div>
						<Input
							type="file"
							inputProps={{ multiple: true }}
							onChange={(e) => setImages(e.target.files)}
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
								<MenuItem value={"country"}>Country</MenuItem>
								<MenuItem value={"foreign"}>Foreign</MenuItem>
							</Select>
							<FormHelperText>
								Tuyến đi trong nước: du khách phải mua vé 24 giờ trước
								khi khởi hành. Nếu trả vé 4 giờ trước khi khởi hành, du
								khách không phải chịu khoảng lệ phí hoàn vé trễ, ngược
								lại, du khách phải đóng thêm khoảng lệ phí hoàn vé trễ
								là 100 000 đồng
							</FormHelperText>
							<FormHelperText>
								Tuyến quốc tế: du khách phải mua vé 7 ngày trước khi
								khởi hành. Nếu trả vé 3 ngày trước khi khởi hành, du
								khách sẽ không phải chịu thêm khoảng lệ phí hoàn vé trễ,
								ngược lại, du khách sẽ phải chịu thêm khoảng lệ phí
								tương đương 50USD
							</FormHelperText>
						</FormControl>
						<h2>Tourist route</h2>
					</div>
					<RouteList list={route} onChange={setRoute} />
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
