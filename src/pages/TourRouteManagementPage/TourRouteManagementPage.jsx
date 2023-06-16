import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	Box,
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
import useCreateRoute from "../../hooks/touristRoute/useCreateRoute";
import styles from "./TourRouteManagementPage.module.scss";

import { ReactComponent as ADD_ICON } from "../../assets/add.svg";
import { ReactComponent as CHECK_ICON } from "../../assets/check.svg";
import { ReactComponent as NEXT_ICON } from "../../assets/chevron.svg";
import { ReactComponent as DELETE_ICON } from "../../assets/delete.svg";
import { ReactComponent as EDIT_ICON } from "../../assets/edit.svg";

import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import { API_ENDPOINT } from "../../constant/api";
import {
	deleteTouristRoutes,
	selectDeleteStatus,
	selectGetListTouristRoutesError,
	selectRoutes,
	setDeleteTouristRouteStatus,
} from "../../features/touristRouteSlice";
import useCallAPIToast from "../../hooks/useCallAPIToast";
import useChangeRoute from "../../hooks/touristRoute/useChangeRoute";

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

	const choosePictureRef = useRef();

	const {
		createRoute,
		data: createdData,
		error: createdError,
	} = useCreateRoute();

	const {
		changeRoute,
		data: changedData,
		error: changedError,
		status: changedStatus,
	} = useChangeRoute();

	const [id, setId] = useState();
	const [routeName, setRouteName] = useState("");
	const [reservationFee, setReservationFee] = useState(0);
	const [description, setDescription] = useState("");
	const [images, setImages] = useState([]);
	const [type, setType] = useState("");
	const [route, setRoute] = useState([]);

	const [isOpenCreateBox, setIsOpenCreateBox] = useState(false);

	const data = useSelector(selectRoutes);
	const { isError, error } = useSelector(selectGetListTouristRoutesError);
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

	// console.log({ changedStatus });
	// useCallAPIToast({
	// 	status: changedStatus,
	// 	message: {
	// 		pending: "Uploading data...",
	// 		success: "Update tourist route successfully",
	// 		fail: "Fail to update tourist route",
	// 	},
	// 	onResponse: () => {
	// 		setSelectedIDs([]);
	// 		dispatch(setDeleteTouristRouteStatus(""));
	// 	},
	// });

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
					.map(async (image, index) =>
						typeof image == "string"
							? image
							: {
									originalname: images[index].name,
									buffer: await images[index].arrayBuffer(),
							  }
					)
			),
			route: route.map(({ content }) => content),
		};

		if (id) changeRoute({ _id: id, ...data });
		else createRoute(data);
	}

	function handleCreate() {
		setId();
		setIsOpenCreateBox(true);
		setRouteName("");
		setDescription("");
		setType();
		setReservationFee(0);
		setRoute([]);
		setImages([]);
	}

	function handleEdit(id) {
		const route = data.find((d) => d._id == id);
		setIsOpenCreateBox(true);
		setId(id);
		setRouteName(route.name);
		setDescription(route.description);
		setType(route.type);
		setReservationFee(route.reservationFee);
		setRoute(
			route.route.map((d, i) => ({
				id: `item-${i}`,
				content: d,
			}))
		);
		setImages(route.images);
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
						onClick={handleCreate}
					>
						Create new tourist route
					</ImageButton>
					<ImageButton
						icon={EDIT_ICON}
						color={COLORS.edit}
						backgroundColor={COLORS.editBackground}
						disabled={selectedIDs.length != 1}
						onClick={() => {
							handleEdit(selectedIDs[0]);
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
						onCellClick={({ row, field }) => {
							const id = row._id;
							if (field != "__check__") {
								handleEdit(id);
							}
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
					<h1>{id ? "Change tourist route" : "Create new route"}</h1>
					<p>{id}</p>
					{id ? (
						<ImageButton
							backgroundColor={COLORS.editBackground}
							color={COLORS.edit}
							icon={NEXT_ICON}
							reversed
							fullWidth
							onClick={() => navigate(id)}
						>
							View detail
						</ImageButton>
					) : null}
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
									<img
										key={images[i]?.name || images[i]}
										src={
											images[i]?.name
												? URL.createObjectURL(images[i])
												: `${API_ENDPOINT.IMAGE}/${images[i]}`
										}
									/>
								))}
						</div>
						<ImageButton
							icon={ADD_ICON}
							backgroundColor={COLORS.editBackground}
							color={COLORS.edit}
							style={{
								paddingTop: 15,
								paddingBottom: 15,
							}}
							fullWidth
							onClick={() => choosePictureRef.current.click()}
						>
							Choose picture
						</ImageButton>
						<Input
							inputRef={choosePictureRef}
							type="file"
							style={{ display: "none" }}
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
					<Box display={"flex"} gap={1}>
						<ImageButton
							backgroundColor={COLORS.submit}
							color={COLORS.submitBackground}
							fullWidth={true}
							icon={CHECK_ICON}
							onClick={handleSubmit}
						>
							Submit
						</ImageButton>
						{id ? (
							<ImageButton
								icon={DELETE_ICON}
								color={COLORS.delete}
								backgroundColor={COLORS.deleteBackground}
								onClick={() => {
									dispatch(deleteTouristRoutes(selectedIDs));
								}}
							>
								Delete
							</ImageButton>
						) : null}
					</Box>
				</div>
			</CenteredModal>
		</>
	);
}
