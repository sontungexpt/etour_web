import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import COLORS from "../../constant/color";

import ImageButton from "../../components/ImageButton/ImageButton";
import styles from "./TourRouteManagementPage.module.scss";

import { ReactComponent as ADD_ICON } from "../../assets/add.svg";
import { ReactComponent as DELETE_ICON } from "../../assets/delete.svg";
import { ReactComponent as EDIT_ICON } from "../../assets/edit.svg";

import { useDispatch, useSelector } from "react-redux";
import EditTouristRouteModal, {
	TOURIST_ROUTE_DEFAULT_VALUE,
	useEditTouristRouteModalState,
} from "../../components/EditTouristRouteModal/EditTouristRouteModal";
import {
	deleteTouristRoutes,
	selectDeleteStatus,
	selectRoutes,
	setDeleteTouristRouteStatus,
} from "../../features/touristRouteSlice";
import useCallAPIToast from "../../hooks/useCallAPIToast";

import { TOURIST_ROUTE_COLUMN } from "../../constant/dataGridColumns";

export default function TourRouteManagementPage() {
	const dispatch = useDispatch();
	const [selectedIDs, setSelectedIDs] = useState([]);

	const { modalState, openModal } = useEditTouristRouteModalState();

	const data = useSelector(selectRoutes);
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

	function handleEdit(id) {
		openModal(data.find((d) => d._id == id));
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
						onClick={() => openModal(TOURIST_ROUTE_DEFAULT_VALUE)}
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
						columns={TOURIST_ROUTE_COLUMN}
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
			<EditTouristRouteModal {...modalState} />
		</>
	);
}
