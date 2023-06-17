import { useRef, useState } from 'react';

import dayjs from 'dayjs';

import _ from 'lodash';

import {
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import COLORS from '@/constant/color';

import CenteredModal from '@/components/CenteredModal/CenteredModal';
import { API_ENDPOINT } from '@/constant/api';
import useCreateTour from '@/hooks/tour/useCreateTour';

import { ReactComponent as ADD_ICON } from '@/assets/add.svg';
import { ReactComponent as NEXT_ICON } from '@/assets/chevron.svg';
import { ReactComponent as CHECK_ICON } from '@/assets/check.svg';

import ImageButton from '@/components/ImageButton/ImageButton';

import useUpdateTour from '@/hooks/tour/useUpdateTour';
import styles from './EditTourModal.module.scss';
import { useNavigate } from 'react-router-dom';
import ENDPOINT from '@/constant/endponint';

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
    const navigate = useNavigate();

    const { createTour } = useCreateTour();
    const { updateTour } = useUpdateTour();

    const choosePictureRef = useRef();

    async function handleSubmit() {
        onClose();
        const image =
            typeof data.image == 'string'
                ? data.image
                : data.image?.name
                ? {
                      originalname: data.image.name,
                      buffer: await data.image.arrayBuffer(),
                  }
                : null;
        const submitData = {
            ..._.pick(data, [
                '_id',
                'name',
                'price',
                'description',
                'from',
                'to',
                'type',
                'touristRoute',
            ]),
            ...(image ? { image } : {}),
        };
        if (data._id) updateTour(submitData);
        else createTour(submitData);
    }

    return (
        <CenteredModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.createBox}>
                <h1>{data?._id ? 'Change tour' : 'Create new tour'}</h1>
                {data._id ? (
                    <ImageButton
                        backgroundColor={COLORS.lightEditBackground}
                        color={COLORS.editBackground}
                        icon={NEXT_ICON}
                        reversed
                        fullWidth
                        onClick={() => navigate(`${ENDPOINT.TOUR}/${data._id}`)}
                        style={{
                            padding: '14px 0',
                        }}
                    >
                        View detail
                    </ImageButton>
                ) : null}
                <div className={styles.form}>
                    <TextField
                        value={data.name}
                        onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
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
                                    data.image?.name
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
                        sx={{ display: 'none' }}
                        onChange={(e) => setData((prev) => ({ ...prev, image: e.target.files[0] }))}
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
                        <DateTimePicker
                            label="From"
                            value={dayjs(data.from)}
                            onChange={(d) => setData((prev) => ({ ...prev, from: new Date(d.$d) }))}
                        />
                        <DateTimePicker
                            label="To"
                            value={dayjs(data.to)}
                            onChange={(d) => setData((prev) => ({ ...prev, to: new Date(d.$d) }))}
                        />
                    </LocalizationProvider>
                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="Age"
                            value={data.type}
                            onChange={(e) => setData((prev) => ({ ...prev, type: e.target.value }))}
                        >
                            <MenuItem value={'normal'}>Normal</MenuItem>
                            <MenuItem value={'promotion'}>Promotion</MenuItem>
                        </Select>
                        <FormHelperText>Normal nè</FormHelperText>
                        <FormHelperText>Promotion nè</FormHelperText>
                    </FormControl>
                </div>
                <ImageButton
                    backgroundColor={COLORS.submit}
                    color={COLORS.submitBackground}
                    fullWidth={true}
                    icon={CHECK_ICON}
                    onClick={handleSubmit}
                    style={{ padding: '15px 0' }}
                >
                    Submit
                </ImageButton>
            </div>
        </CenteredModal>
    );
}
