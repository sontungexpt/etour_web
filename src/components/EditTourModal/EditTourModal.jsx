import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import _ from "lodash";

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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import COLORS from "../../constant/color";

import { toast } from "react-toastify";
import CenteredModal from "../../components/CenteredModal/CenteredModal";
import { API_ENDPOINT } from "../../constant/api";
import useCreateTour from "../../hooks/useCreateTour";
import usePersistentState from "../../hooks/usePersistentState";
import useRouteById from "../../hooks/useRouteById";
import useTourByRouteId from "../../hooks/useTourByRouteId";
import useTouristRoute from "../../hooks/useTouristRoute";

import { ReactComponent as EDIT_ICON } from "../../assets/edit.svg";
import { ReactComponent as ADD_ICON } from "../../assets/add.svg";

import ImageButton from "../../components/ImageButton/ImageButton";
import EditTouristRouteModal, {
	useEditTouristRouteModalState,
} from "../../components/EditTouristRouteModal/EditTouristRouteModal";

import styles from "./EditTourModal.module.scss";
import useCallAPIToast from "../../hooks/useCallAPIToast";

export function useEditTourModalState(touristRoute) {
	const [isOpenCreateBox, setIsOpenCreateBox] = useState(false);

	const [data, _setData] = useState({});

	function updateData(newData) {
		if (newData instanceof Function) {
			_setData((prev) => ({
				...newData(prev),
				touristRoute,
			}));
		} else {
			_setData({
				...newData,
				touristRoute,
			});
		}
	}

	return {
		modalState: {
			isOpen: isOpenCreateBox,
			onClose: () => setIsOpenCreateBox(false),
			data,
			setData: updateData,
		},
		data,
		setData: updateData,
		openModal: (data) => {
			setIsOpenCreateBox(true);
			updateData(data);
		},
		closeModal: () => setIsOpenCreateBox(false),
	};
}

export default function EditTourModal({ isOpen, onClose, data, setData }) {
	const {
		createTour,
		error: createdError,
		status: createdStatus,
	} = useCreateTour();

	useCallAPIToast({
		status: createdStatus,
		message: {
			pending: "Uploading data...",
			success: "Create tour successfully",
			fail: `Fail to create tour: ${createdError?.message}`,
		},
	});

	const choosePictureRef = useRef();

	async function handleSubmit() {
		onClose();
		const image =
			typeof data.image == "string"
				? data.image
				: data.image
				? {
						originalname: data.image.name,
						buffer: await data.image.arrayBuffer(),
				  }
				: null;
		const submitData = {
			..._.pick(data, [
				"name",
				"price",
				"description",
				"file",
				"from",
				"to",
				"type",
				"touristRoute",
			]),
			...(image ? { image } : {}),
		};
		console.log({ submitData });
		createTour(submitData);
	}

	return (
		<CenteredModal isOpen={isOpen} onClose={onClose}>
			<div className={styles.createBox}>
				<h1>{data?._id ? "Change tour" : "Create new tour"}</h1>
				<div className={styles.form}>
					<TextField
						value={data.name}
						onChange={(e) =>
							setData((prev) => ({ ...prev, name: e.target.value }))
						}
						label="Tour name"
						variant="standard"
					/>
					<TextField
						value={data.price}
						onChange={(e) =>
							setData((prev) => ({
								...prev,
								price: parseInt(e.target.value),
							}))
						}
						type="number"
						label="Price"
						variant="standard"
					/>
					<div className={styles.imagePreview}>
						{data.image ? (
							<img
								src={
									data.image
										? URL.createObjectURL(data.image)
										: `${API_ENDPOINT.IMAGE}/${data.image}`
								}
							/>
						) : null}
					</div>
					<ImageButton
						icon={ADD_ICON}
						backgroundColor={COLORS.lightEditBackground}
						color={COLORS.editBackground}
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
						type="file"
						inputRef={choosePictureRef}
						inputProps={{ multiple: false }}
						sx={{ display: "none" }}
						onChange={(e) =>
							setData((prev) => ({ ...prev, image: e.target.files[0] }))
						}
					/>
					<TextField
						value={data.description}
						onChange={(e) =>
							setData((prev) => ({
								...prev,
								description: e.target.value,
							}))
						}
						label="Description"
						variant="standard"
					/>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							label="From"
							onChange={(d) =>
								setData((prev) => ({ ...prev, from: new Date(d.$d) }))
							}
						/>
						<DatePicker
							label="To"
							onChange={(d) =>
								setData((prev) => ({ ...prev, to: new Date(d.$d) }))
							}
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
							value={data.type}
							onChange={(e) =>
								setData((prev) => ({ ...prev, type: e.target.value }))
							}
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
	);
}
