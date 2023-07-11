import { useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Input,
    TextField,
} from '@mui/material';

import COLORS from '@/constant/color';

import CenteredModal from '@/components/CenteredModal/CenteredModal';
import { API_ENDPOINT } from '@/constant/api';

import { ReactComponent as ADD_ICON } from '@/assets/add.svg';
import { ReactComponent as CHECK_ICON } from '@/assets/check.svg';
import { ReactComponent as DELETE_ICON } from '@/assets/delete.svg';

import ImageButton from '@/components/ImageButton/ImageButton';

import apiInstance from '@/api/instance';
import { STAFF_PERMISSION, StaffPermission } from '@/constant/staffPermission.ts';
import { STATUS } from '@/constant/status';
import useCallAPIToast from '@/hooks/useCallAPIToast';
import styles from './AddStaffModal.module.scss';

export function useAddStaffState({ onUpdate }) {
    const [isOpenCreateBox, setIsOpenCreateBox] = useState(false);

    const [data, _setData] = useState({ permissions: [] });

    return {
        modalState: {
            isOpen: isOpenCreateBox,
            onClose: () => setIsOpenCreateBox(false),
            data,
            setData: _setData,
            onUpdate,
        },
        data,
        setData: _setData,
        openModal: (data) => {
            setIsOpenCreateBox(true);
            _setData(data);
        },
        closeModal: () => setIsOpenCreateBox(false),
    };
}

export default function AddStaffModal({ isOpen, onClose, data, setData, onUpdate }) {
    const {
        register,
        unregister,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [status, setStatus] = useState();

    const choosePictureRef = useRef();

    useCallAPIToast({
        status,
        message: {
            pending: 'Uploading data...',
            success: 'Add successfully',
            fail: 'Fail to add staff',
        },
    });

    useEffect(() => {
        if (data?._id) {
            unregister('username');
            unregister('password');
        }
    }, [data]);

    async function onSubmit() {
        onClose();

        const submitData = new FormData();
        submitData.append('fullName', data.fullName);
        submitData.append('role', data.role);
        submitData.append('image', data.image);
        data.permissions.forEach((p) => submitData.append('permissions', p));
        if (!data._id) {
            submitData.append('username', data.username);
            submitData.append('password', data.password);
        }

        setStatus(STATUS.PENDING);

        const res = data?._id
            ? await apiInstance.put(`${API_ENDPOINT.STAFF}/${data?._id}`, submitData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              })
            : await apiInstance.post(`${API_ENDPOINT.STAFF}`, submitData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              });

        if (res.status == 200) {
            setStatus(STATUS.SUCCESS);
            onUpdate?.(res.data.data);
        } else {
            setStatus(STATUS.FAIL);
        }
    }

    async function handleDeleteStaff() {
        onClose();

        setStatus(STATUS.PENDING);

        const res = await apiInstance.delete(`${API_ENDPOINT.STAFF}/${data?._id}`);

        if (res.status == 200) {
            setStatus(STATUS.SUCCESS);
            onUpdate?.(data, 'delete');
        } else {
            setStatus(STATUS.FAIL);
        }
    }

    return (
        <CenteredModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.createBox}>
                <h1>{data?._id ? 'Change staff information' : 'Create new staff'}</h1>
                <div className={styles.form}>
                    {data?._id ? null : (
                        <>
                            <p className={styles.title}>Staff credential</p>
                            <TextField
                                value={data.username}
                                color={errors.username ? 'error' : 'primary'}
                                onChange={(e) =>
                                    setData((prev) => ({ ...prev, username: e.target.value }))
                                }
                                label="Username"
                                variant="standard"
                                required
                                inputProps={register('username', {
                                    required: 'Staff username is required',
                                    min: 6,
                                })}
                            />
                            {errors.username && (
                                <p className={styles.error}>{errors.username.message}</p>
                            )}
                            <TextField
                                value={data.password}
                                color={errors.password ? 'error' : 'primary'}
                                onChange={(e) =>
                                    setData((prev) => ({ ...prev, password: e.target.value }))
                                }
                                label="Password"
                                type="password"
                                variant="standard"
                                required
                                inputProps={register('password', {
                                    required: 'Staff password is required',
                                    min: 6,
                                })}
                            />
                            {errors.password && (
                                <p className={styles.error}>{errors.password.message}</p>
                            )}
                        </>
                    )}
                    <p className={styles.title}>Staff basic information</p>
                    <TextField
                        value={data.fullName}
                        color={errors.fullName ? 'error' : 'primary'}
                        onChange={(e) => setData((prev) => ({ ...prev, fullName: e.target.value }))}
                        label="Fullname"
                        variant="standard"
                        required
                        inputProps={register('fullname', {
                            required: 'Staff fullname is required',
                        })}
                    />
                    {errors.fullName && <p className={styles.error}>{errors.fullName.message}</p>}
                    <TextField
                        value={data.role}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                role: e.target.value,
                            }))
                        }
                        label="Role"
                        variant="standard"
                        required
                        inputProps={register('role', { required: 'Staff role is required' })}
                    />
                    {errors.role && <p className={styles.error}>{errors.role.message}</p>}
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
                        <FormLabel component="legend">{`Choose staff permission (${
                            (data?.permissions || []).length
                        } permissons chosen)`}</FormLabel>
                        <FormGroup>
                            {STAFF_PERMISSION.map((permission) => (
                                <FormControlLabel
                                    key={permission}
                                    control={
                                        <Checkbox
                                            checked={(data?.permissions || []).includes(permission)}
                                            onChange={() => {
                                                if (
                                                    (data?.permissions || []).includes(permission)
                                                ) {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        permissions: [
                                                            ...(data?.permissions || []).filter(
                                                                (d) => d != permission
                                                            ),
                                                        ],
                                                    }));
                                                } else {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        permissions: [
                                                            ...(data?.permissions || []),
                                                            permission,
                                                        ],
                                                    }));
                                                }
                                            }}
                                            name={permission}
                                        />
                                    }
                                    label={permission.split('-').join(' ')}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                    {errors.type && <p className={styles.error}>{errors.type.message}</p>}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
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
                    <ImageButton
                        backgroundColor={COLORS.deleteBackground}
                        color={COLORS.delete}
                        // fullWidth={true}
                        icon={DELETE_ICON}
                        onClick={handleDeleteStaff}
                        style={{ padding: '15px 20px' }}
                    >
                        Delete
                    </ImageButton>
                </div>
            </div>
        </CenteredModal>
    );
}
