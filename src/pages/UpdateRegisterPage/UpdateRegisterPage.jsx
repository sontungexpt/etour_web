import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './UpdateRegisterPage.module.scss';
import Camera from '@/assets/camera.svg';
import { Button, Input, TextareaAutosize } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ENDPOINT from '@/constant/endponint';
import { registerAdminFromCompany, updateCompanyInformation } from '@/api/company';
import useAuthenticationState from '@/hooks/useAuthenticationState';
import AUTHENTICATION_STATE from '@/constant/authenticationState';
import useCompanyInformation from '@/hooks/useCompanyInformation';
import Loading from '@/components/Loading/Loading';
import { avatarStorage, imageStorage } from '@/lib/image';
import { randomUUID } from '@/lib/operation';

const UpdateRegisterPage = () => {
    const authenticationState = useAuthenticationState();
    const navigate = useNavigate();
    const { data: companyData } = useCompanyInformation();
    useEffect(() => {
        if (authenticationState !== AUTHENTICATION_STATE.AUTHENTICATED) {
            navigate(ENDPOINT.ON_BOARDING);
        }
    }, [authenticationState, companyData]);
    useEffect(() => {
        if (companyData) {
            if (companyData.isApproveToActive) {
                navigate(ENDPOINT.HOME);
            }
        }
    }, [companyData]);
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
        reset,
    } = useForm();

    const [loading, setLoading] = React.useState(false);

    const image = watch('image');
    const isImageUploaded = image && image.length > 0;

    const disabledSubmit = errors && Object.keys(errors).length > 0;
    const previewImages = watch('previewImages');
    const previewImagesArray =
        previewImages && previewImages.length > 0
            ? Array.from(previewImages)
            : companyData?.previewImages;
    const onSubmit = async (data) => {
        setLoading(true);
        toast.loading('Updating...');
        try {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                if (key === 'image') {
                    if (data[key][0]) {
                        formData.append(key, data[key][0]);
                    }
                } else if (key === 'previewImages') {
                    Array.from(data[key]).forEach((image) => {
                        if (typeof image !== 'string') {
                            formData.append('previewImages', image);
                        }
                    });
                } else {
                    formData.append(key, data[key]);
                }
            });

            const res = await updateCompanyInformation(formData, companyData._id);
            const resData = res.data;
            toast.dismiss();
            toast.success('Update registration successfully');
            reset();
            navigate(ENDPOINT.HOME);
        } catch (err) {
            toast.dismiss();
            toast.error('Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (!companyData) {
        return <Loading />;
    }

    return (
        <div className={styles.wrapper}>
            <h2>Update your company registration</h2>
            <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <p>Company logo</p>
                    <label htmlFor="image" style={styles.label}>
                        <img
                            src={
                                isImageUploaded
                                    ? URL.createObjectURL(image[0])
                                    : avatarStorage(companyData.image)
                            }
                            alt="Camera"
                        />
                        <Controller
                            control={control}
                            name="image"
                            render={({ field: { value, onChange, ...field } }) => (
                                <input
                                    type={'file'}
                                    id="image"
                                    accept=".png, .jpg, .jpeg"
                                    {...register('image')}
                                />
                            )}
                        />
                    </label>
                    <p>Company preview images</p>

                    <label htmlFor="previewImages" style={styles.label}>
                        <p role="button">Select multiple files</p>
                        <div className={styles.previewImagesContainer}>
                            {previewImagesArray.length > 0 &&
                                previewImagesArray.map((image) => {
                                    return (
                                        <img
                                            src={
                                                typeof image !== 'string'
                                                    ? URL.createObjectURL(image)
                                                    : imageStorage(image)
                                            }
                                            alt="preview"
                                            key={randomUUID()}
                                            className={styles.previewImage}
                                        />
                                    );
                                })}
                        </div>
                        <Controller
                            control={control}
                            name="previewImages"
                            render={({ field: { value, onChange, ...field } }) => (
                                <input
                                    multiple
                                    type={'file'}
                                    id="previewImages"
                                    accept=".png, .jpg, .jpeg"
                                    {...register('previewImages')}
                                />
                            )}
                        />
                    </label>

                    <p>Company description</p>
                    <label htmlFor="description" className={styles.label}>
                        <Controller
                            control={control}
                            name="description"
                            rules={{ required: 'Description is required' }}
                            render={({ field: { value, onChange, ...field } }) => (
                                <textarea
                                    id="description"
                                    {...register('description')}
                                    placeholder="The greatest company"
                                    defaultValue={companyData?.description}
                                />
                            )}
                        />
                        {errors.description && (
                            <p className={styles.error}>{errors.description.message}</p>
                        )}
                    </label>
                </div>
                <div>
                    <label
                        htmlFor="name"
                        className={styles.label}
                        style={{
                            width: 400,
                        }}
                    >
                        <p>Company name</p>
                        <Controller
                            control={control}
                            name="name"
                            rules={{ required: 'Company name is required' }}
                            render={({ field: { value, onChange, ...field } }) => (
                                <Input
                                    type="text"
                                    id="name"
                                    {...register('name')}
                                    placeholder="E-Tour"
                                    size="medium"
                                    fullWidth
                                    error={!!errors.name}
                                    defaultValue={companyData?.name}
                                />
                            )}
                        />
                        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
                    </label>
                    <label
                        htmlFor="phone"
                        className={styles.label}
                        style={{
                            width: 400,
                        }}
                    >
                        <p>Phone number</p>
                        <Controller
                            control={control}
                            name="phone"
                            rules={{
                                required: 'Company phone number is required',
                                validate: (value) => {
                                    if (value.length < 10) {
                                        return 'Phone number must be at least 10 characters';
                                    }
                                    const regex =
                                        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                                    if (!regex.test(value)) {
                                        return 'Invalid phone number';
                                    }
                                },
                            }}
                            render={({ field: { value, onChange, ...field } }) => (
                                <Input
                                    type="tel"
                                    id="phone"
                                    {...register('phone')}
                                    placeholder="0123456789"
                                    size="medium"
                                    fullWidth
                                    error={!!errors.phone}
                                    defaultValue={companyData?.phone}
                                />
                            )}
                        />
                        {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
                    </label>
                    <label
                        htmlFor="address"
                        className={styles.label}
                        style={{
                            width: 400,
                        }}
                    >
                        <p>Address</p>
                        <Controller
                            control={control}
                            name="address"
                            rules={{ required: 'Company address is required' }}
                            render={({ field: { value, onChange, ...field } }) => (
                                <Input
                                    id="address"
                                    type="text"
                                    {...register('address')}
                                    placeholder="Thu Duc, Ho Chi Minh City, Vietnam"
                                    size="medium"
                                    fullWidth
                                    error={!!errors.address}
                                    defaultValue={companyData?.address}
                                />
                            )}
                        />
                        {errors.address && <p className={styles.error}>{errors.address.message}</p>}
                    </label>
                    <label
                        htmlFor="checked"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '40px auto',
                            margin: '1rem 0',
                        }}
                    >
                        <Controller
                            control={control}
                            name="checked"
                            rules={{ required: 'Please agree term and conditions' }}
                            render={({ field: { value, onChange, ...field } }) => (
                                <Input
                                    id="checked"
                                    type="checkbox"
                                    {...register('checked')}
                                    placeholder="example@mail.com"
                                    size="medium"
                                    fullWidth
                                    error={!!errors.checked}
                                />
                            )}
                        />
                        <p>Agree to the terms and conditions</p>
                        {errors.checked && (
                            <p
                                className={styles.error}
                                style={{
                                    gridColumn: '1 / 3',
                                }}
                            >
                                {errors.checked.message}
                            </p>
                        )}
                    </label>
                    <Button variant="contained" type="submit" disabled={disabledSubmit || loading}>
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default UpdateRegisterPage;
