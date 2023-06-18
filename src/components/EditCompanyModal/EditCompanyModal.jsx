import COLORS from '@/constant/color';
import CenteredModal from '../CenteredModal/CenteredModal';

import { ReactComponent as ADD_ICON } from '@/assets/add.svg';
import { ReactComponent as CHECK_ICON } from '@/assets/check.svg';
import { ReactComponent as NEXT_ICON } from '@/assets/chevron.svg';
import { ReactComponent as DELETE_ICON } from '@/assets/delete.svg';
import { API_ENDPOINT } from '@/constant/api';
import { Box, Input, TextField } from '@mui/material';

import axios from 'axios';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import ImageButton from '../ImageButton/ImageButton';
import styles from './EditCompanyModal.module.scss';
import apiInstance from '@/api/instance';
import { STATUS } from '@/constant/status';
import useCallAPIToast from '@/hooks/useCallAPIToast';

export const TOURIST_ROUTE_DEFAULT_VALUE = {
    name: '',
    reservationFee: 0,
    description: '',
    images: [],
    type: '',
    route: [],
};

export function useEditCompanyModalState(companyData) {
    const [isOpenCreateBox, setIsOpenCreateBox] = useState(false);

    const [data, _setData] = useState(companyData || {});

    function updateData(newData) {
        _setData(newData);
    }

    return {
        modalState: {
            isOpen: isOpenCreateBox,
            onClose: () => setIsOpenCreateBox(false),
            data,
            setData: _setData,
            companyId: companyData?._id,
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

    const [status, setStatus] = useState();

    const choosePreviewImagesRef = useRef();
    const chooseImageRef = useRef();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useCallAPIToast({
        status,
        message: {
            pending: 'Uploading data?...',
            success: 'Update company profile',
            fail: 'Fail to update company profile',
        },
    });

    async function onSubmit() {
        onClose();

        setStatus(STATUS.PENDING);
        const formData = new FormData();
        formData.append('name', data?.name);
        formData.append('email', data?.email);
        formData.append('description', data?.description);
        formData.append('image', data?.image);
        formData.append('previewImages', data?.previewImages);

        const res = await apiInstance.put(`http://localhost/company/${companyId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (res.status == 200) {
            setStatus(STATUS.SUCCESS);
            setData(res.data?.data);
        } else {
            setStatus(STATUS.FAIL);
        }
    }

    return (
        <CenteredModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.createBox}>
                <h1>Edit company profile</h1>
                <div className={styles.form}>
                    <TextField
                        value={data?.name}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        label="Name"
                        variant="standard"
                        required
                        inputProps={register('name', { required: 'Company name is required' })}
                    />
                    {errors.name && <p className={styles.error}>{errors.name.message}</p>}
                    <TextField
                        value={data?.email}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                        label="Email"
                        required
                        multiline
                        variant="standard"
                    />
                    {errors.email && <p className={styles.error}>{errors.email.message}</p>}
                    <TextField
                        value={data?.description}
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
                    <img
                        className={styles.image}
                        key={data?.image?.name || data?.image}
                        src={
                            data?.image?.name
                                ? URL.createObjectURL(data?.image)
                                : `${API_ENDPOINT.IMAGE}/${data?.image}`
                        }
                    />
                    <ImageButton
                        icon={ADD_ICON}
                        backgroundColor={COLORS.editBackground}
                        color={COLORS.edit}
                        style={{
                            paddingTop: 15,
                            paddingBottom: 15,
                        }}
                        fullWidth
                        onClick={() => chooseImageRef.current.click()}
                    >
                        Choose company image
                    </ImageButton>
                    <Input
                        inputRef={chooseImageRef}
                        type="file"
                        style={{ display: 'none' }}
                        inputProps={{ multiple: false }}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                image: e.target.files[0],
                            }))
                        }
                    />
                    <div className={styles.imagePreview}>
                        {Array((data?.previewImages || []).length)
                            .fill('')
                            .map?.((_, i) => (
                                <img
                                    key={data?.previewImages[i]?.name || data?.previewImages[i]}
                                    src={
                                        data?.previewImages[i]?.name
                                            ? URL.createObjectURL(data?.previewImages[i])
                                            : `${API_ENDPOINT.IMAGE}/${data?.previewImages[i]}`
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
                        onClick={() => choosePreviewImagesRef.current.click()}
                    >
                        Choose preview images
                    </ImageButton>
                    <Input
                        inputRef={choosePreviewImagesRef}
                        type="file"
                        style={{ display: 'none' }}
                        inputProps={{ multiple: true }}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                previewImages: e.target.files,
                            }))
                        }
                    />
                </div>
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
                    {data?._id ? (
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
