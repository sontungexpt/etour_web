import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box } from '@mui/material';

import COLORS from '@/constant/color';

import { API_ENDPOINT } from '@/constant/api';
import useTourByRouteId from '@/hooks/tour/useTourByRouteId';
import useRouteById from '@/hooks/touristRoute/useRouteById';

import { ReactComponent as ADD_ICON } from '@/assets/add.svg';
import { ReactComponent as DELETE_ICON } from '@/assets/delete.svg';
import { ReactComponent as EDIT_ICON } from '@/assets/edit.svg';

import { DataGrid } from '@mui/x-data-grid';
import EditTourModal, { useEditTourModalState } from '@/components/EditTourModal/EditTourModal';
import EditTouristRouteModal, {
    useEditTouristRouteModalState,
} from '@/components/EditTouristRouteModal/EditTouristRouteModal';
import ImageButton from '@/components/ImageButton/ImageButton';
import { TOUR_COLUMN } from '@/constant/dataGridColumns';
import useDeleteTour from '@/hooks/tour/useDeleteTour';
import styles from './DetailRoutePage.module.scss';

export default function DetailRoutePage() {
    const navigate = useNavigate();
    const [selectedIDs, setSelectedIDs] = useState([]);

    const { id } = useParams();

    const { modalState: editTourModalState, openModal: openEditTourModal } =
        useEditTourModalState(id);

    const { deleteTour } = useDeleteTour();
    const { data: routeInformation } = useRouteById(id);
    const { data: tours } = useTourByRouteId(id);
    const { modalState, openModal } = useEditTouristRouteModalState();

    const handleEdit = (id) => {
        openEditTourModal(tours.find((tour) => tour._id == id));
    };

    const handleDelete = () => {
        deleteTour(selectedIDs);
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.title}>Tourist route name</p>
                    <h1>{routeInformation?.name}</h1>
                    <p className={styles.title}>Description</p>
                    <p>{routeInformation?.description}</p>
                    {/* <p className={styles.title}>Tourist route type</p>
					<p>{routeInformation?.type} </p> */}
                    <p className={styles.title}>Reservation fee</p>
                    <p>{routeInformation?.reservationFee}</p>
                    <p className={styles.title}>Route</p>
                    <p>{routeInformation?.route?.join(' - ')} </p>
                    <p className={styles.title}>Tourist route images</p>
                    <div className={styles.imagePreview}>
                        {routeInformation?.images?.map((image) => (
                            <img key={image} src={`${API_ENDPOINT.IMAGE}/${image}`} />
                        ))}
                    </div>
                    <ImageButton
                        onClick={() => openModal(routeInformation)}
                        backgroundColor={COLORS.lightEditBackground}
                        color={COLORS.editBackground}
                        icon={EDIT_ICON}
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: 30,
                        }}
                    >
                        Edit
                    </ImageButton>
                </div>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ImageButton
                        onClick={() => openEditTourModal({})}
                        backgroundColor={COLORS.editBackground}
                        color={COLORS.edit}
                        icon={ADD_ICON}
                    >
                        Add new tour
                    </ImageButton>
                    <ImageButton
                        onClick={handleDelete}
                        backgroundColor={COLORS.deleteBackground}
                        color={COLORS.delete}
                        icon={DELETE_ICON}
                    >
                        Delete
                    </ImageButton>
                </Box>
                <div className={styles.data}>
                    <DataGrid
                        rows={tours || []}
                        columns={TOUR_COLUMN}
                        getRowId={(row) => row._id}
                        checkboxSelection
                        onCellClick={({ row, field }) => {
                            const id = row._id;
                            if (field != '__check__') {
                                handleEdit(id);
                            }
                            if (selectedIDs.includes(id)) {
                                setSelectedIDs((prev) => [...prev.filter((d) => d != id)]);
                            } else {
                                setSelectedIDs((prev) => [...prev, id]);
                            }
                        }}
                        onColumnHeaderClick={({ field }) => {
                            if (field == '__check__')
                                if (selectedIDs.length == 0) {
                                    setSelectedIDs(tours.map((row) => row._id));
                                } else {
                                    setSelectedIDs([]);
                                }
                        }}
                    />
                </div>
            </div>
            <EditTourModal {...editTourModalState} />
            <EditTouristRouteModal {...modalState} />
        </>
    );
}
