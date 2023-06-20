import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import COLORS from '../../constant/color';

import ImageButton from '@/components/ImageButton/ImageButton';
import styles from './TourManagementPage.module.scss';

import { ReactComponent as DELETE_ICON } from '@/assets/delete.svg';
import { ReactComponent as EDIT_ICON } from '@/assets/edit.svg';

import { useDispatch } from 'react-redux';

import EditTourModal, { useEditTourModalState } from '@/components/EditTourModal/EditTourModal';
import { TOUR_COLUMN } from '@/constant/dataGridColumns';
import useDeleteTour from '@/hooks/tour/useDeleteTour';
import useGetAPI from '@/hooks/useCallAPI';
import ExportButton from '@/components/ExportButton/ExportButton';

export default function TourManagementPage() {
    const dispatch = useDispatch();
    const [selectedIDs, setSelectedIDs] = useState([]);
    const { data } = useGetAPI('view-company-tour', 'company-tour');

    const { deleteTour } = useDeleteTour({
        onSuccess: () => setSelectedIDs([]),
    });

    const { modalState, openModal } = useEditTourModalState();

    function handleEdit(id) {
        openModal(data.find((d) => d._id == id));
    }

    return (
        <>
            <div className={styles.container}>
                <h1>Manage tour</h1>
                <div className={styles.buttonGroup}>
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
                            deleteTour(selectedIDs);
                        }}
                    >
                        Delete
                    </ImageButton>
                    <ExportButton data={data} columns={TOUR_COLUMN} fileName={`Tour data`} />
                </div>
                <div className={styles.data}>
                    <DataGrid
                        rows={data || []}
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
            <EditTourModal {...modalState} />
        </>
    );
}
