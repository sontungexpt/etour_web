import PropTypes from 'prop-types';
import COLORS from '@/constant/color';
import CenteredModal from '../CenteredModal/CenteredModal';

import _ from 'lodash';

import {
    Box,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { ReactComponent as ADD_ICON } from '@/assets/add.svg';
import { ReactComponent as CHECK_ICON } from '@/assets/check.svg';
import { ReactComponent as NEXT_ICON } from '@/assets/chevron.svg';
import { ReactComponent as DELETE_ICON } from '@/assets/delete.svg';
import RouteList from '@/components/RouteList/RouteList';
import { API_ENDPOINT } from '@/constant/api';

import { useRef, useState, memo } from 'react';
import { useNavigate } from 'react-router';
import useChangeRoute from '@/hooks/touristRoute/useChangeRoute';
import useCreateRoute from '@/hooks/touristRoute/useCreateRoute';
import useCallAPIToast from '@/hooks/useCallAPIToast';
import ImageButton from '../ImageButton/ImageButton';
import styles from './EditTouristRouteModal.module.scss';
import { useSendDataAPI } from '@/hooks/useCallAPI';
import axios from 'axios';
import { useForm } from 'react-hook-form';

export const TOURIST_ROUTE_DEFAULT_VALUE = {
    name: '',
    reservationFee: 0,
    description: '',
    images: [],
    type: '',
    route: [],
};

export function editCompanyModalState() {
    const [isOpenCreateBox, setIsOpenCreateBox] = useState(false);

    const [data, _setData] = useState({
        previewImages: [],
    });

    function updateData(newData) {
        _setData(...newData);
    }

    return {
        modalState: {
            isOpen: isOpenCreateBox,
            onClose: () => setIsOpenCreateBox(false),
            data,
            setData: _setData,
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

export default function EditCompanyModal({ isOpen, onClose, data, setData, companyId }) {
    const navigate = useNavigate();

    const choosePictureRef = useRef();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    async function onSubmit() {
        onClose();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('description', data.description);
        formData.append('image', data.image);
        formData.append('previewImages', data.previewImages);

        axios.put(`${API_ENDPOINT.COMPANY}/${companyId}`);
    }

    return (
        <CenteredModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.createBox}>
                <h1>{data._id ? 'Change tourist route' : 'Create new route'}</h1>
                <p>{data._id}</p>
                {data._id ? (
                    <ImageButton
                        backgroundColor={COLORS.lightEditBackground}
                        color={COLORS.editBackground}
                        icon={NEXT_ICON}
                        reversed
                        fullWidth
                        onClick={() => navigate(data._id)}
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
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        label="Fullname"
                        variant="standard"
                        required
                        inputProps={register('title', { required: 'Title is required' })}
                    />
                    {errors.title && <p className={styles.error}>{errors.title.message}</p>}
                    <TextField
                        value={data.description}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                        label="Description"
                        multiline
                        variant="standard"
                    />
                    <div className={styles.imagePreview}>
                        {Array((data.images || []).length)
                            .fill('')
                            .map?.((_, i) => (
                                <img
                                    key={data.images[i]?.name || data.images[i]}
                                    src={
                                        data.images[i]?.name
                                            ? URL.createObjectURL(data.images[i])
                                            : `${API_ENDPOINT.IMAGE}/${data.images[i]}`
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
                        style={{ display: 'none' }}
                        inputProps={{ multiple: true }}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                images: e.target.files,
                            }))
                        }
                    />
                    <TextField
                        error={!Number.isInteger(parseInt(data.reservationFee))}
                        value={data.reservationFee}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                reservationFee: e.target.value,
                            }))
                        }
                        label="Reservation fee"
                        helperText="Reservation fee must be a integer"
                        variant="standard"
                    />
                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="Age"
                            value={data.type}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    type: e.target.value,
                                }))
                            }
                        >
                            <MenuItem value={'country'}>Country</MenuItem>
                            <MenuItem value={'foreign'}>Foreign</MenuItem>
                        </Select>
                        <FormHelperText>
                            Tuyến đi trong nước: du khách phải mua vé 24 giờ trước khi khởi hành.
                            Nếu trả vé 4 giờ trước khi khởi hành, du khách không phải chịu khoảng lệ
                            phí hoàn vé trễ, ngược lại, du khách phải đóng thêm khoảng lệ phí hoàn
                            vé trễ là 100 000 đồng
                        </FormHelperText>
                        <FormHelperText>
                            Tuyến quốc tế: du khách phải mua vé 7 ngày trước khi khởi hành. Nếu trả
                            vé 3 ngày trước khi khởi hành, du khách sẽ không phải chịu thêm khoảng
                            lệ phí hoàn vé trễ, ngược lại, du khách sẽ phải chịu thêm khoảng lệ phí
                            tương đương 50USD
                        </FormHelperText>
                    </FormControl>
                    <h2>Tourist route</h2>
                </div>
                <RouteList
                    list={data.route}
                    onChange={(newRoute) =>
                        setData((prev) => ({
                            ...prev,
                            route: newRoute,
                        }))
                    }
                />
                <Box display={'flex'} gap={1}>
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
                    {data._id ? (
                        <ImageButton
                            icon={DELETE_ICON}
                            color={COLORS.delete}
                            backgroundColor={COLORS.deleteBackground}
                            style={{ padding: '15px 20px' }}
                        >
                            Delete
                        </ImageButton>
                    ) : null}
                </Box>
            </div>
        </CenteredModal>
    );
}
