import { useRef, useState } from 'react';

import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';

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

import { ReactComponent as ADD_ICON } from '@/assets/add.svg';
import { ReactComponent as CHECK_ICON } from '@/assets/check.svg';

import ImageButton from '@/components/ImageButton/ImageButton';

import usePushTourNotification from '@/hooks/notification/usePushTourNotification';
import { useNavigate } from 'react-router-dom';
import styles from './EditNotificationModal.module.scss';
import { toast } from 'react-toastify';

export function useEditNotificationState(tourId) {
    const [isOpenCreateBox, setIsOpenCreateBox] = useState(false);

    const [data, _setData] = useState({});

    function updateData(newData) {
        if (newData instanceof Function) {
            _setData((prev) => ({
                ...newData(prev),
            }));
        } else {
            _setData(newData);
        }
    }

    return {
        modalState: {
            isOpen: isOpenCreateBox,
            onClose: () => setIsOpenCreateBox(false),
            data,
            tourId,
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

export default function EditNotificationModal({ isOpen, onClose, data, tourId, setData }) {
    const navigate = useNavigate();

    const { pushTourNotification } = usePushTourNotification();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const choosePictureRef = useRef();

    async function onSubmit() {
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
            tourId,
            type: data.type || 'all',
            notification: {
                ..._.pick(data, 'title', 'content', 'image'),
                ...(image ? { image } : {}),
            },
        };

        pushTourNotification(submitData);
    }

    return (
        <CenteredModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.createBox}>
                <h1>Create new notification</h1>
                <div className={styles.form}>
                    <TextField
                        value={data.title}
                        color={errors.title ? 'error' : 'primary'}
                        onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
                        label="Title"
                        variant="standard"
                        required
                        inputProps={register('title', { required: 'Title is required' })}
                    />
                    {errors.title && <p className={styles.error}>{errors.title.message}</p>}
                    <TextField
                        value={data.content}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                price: parseInt(e.target.value),
                            }))
                        }
                        label="Content"
                        multiline
                        variant="standard"
                        required
                        inputProps={register('content', { required: 'Content is required' })}
                    />
                    {errors.content && <p className={styles.error}>{errors.content.message}</p>}
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
                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                        <InputLabel id="notification-type-select">Notification type</InputLabel>
                        <Select
                            labelId="notification-type-select"
                            label="Notification type"
                            value={data.type}
                            required
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    type: e.target.value,
                                }))
                            }
                            inputProps={register('type', {
                                required: 'Notification type is required',
                            })}
                        >
                            <MenuItem value={'all'} divider>
                                Urgent
                            </MenuItem>
                            <MenuItem value={'only-special'} divider>
                                Normal
                            </MenuItem>
                        </Select>
                    </FormControl>
                    {errors.type && <p className={styles.error}>{errors.type.message}</p>}
                </div>
                <ImageButton
                    backgroundColor={COLORS.submit}
                    color={COLORS.submitBackground}
                    fullWidth={true}
                    icon={CHECK_ICON}
                    onClick={handleSubmit(onSubmit)}
                    style={{ padding: '15px 0' }}
                >
                    Submit
                </ImageButton>
            </div>
        </CenteredModal>
    );
}
