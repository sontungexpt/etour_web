import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './RegisterPage.module.scss';
import Camera from '@/assets/camera.svg';
import Logo from '@/assets/logo.svg';
import { Button, Input, TextareaAutosize } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ENDPOINT from '@/constant/endponint';
import { registerAdminFromCompany } from '@/api/company';
import useCallAPIToast from '@/hooks/useCallAPIToast';
import { STATUS } from '@/constant/status';

const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
        reset,
    } = useForm();

    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const image = watch('image');
    const isImageUploaded = image && image.length > 0;

    const disabledSubmit = errors && Object.keys(errors).length > 0;
    const previewImages = watch('previewImages');
    const previewImagesArray = previewImages ? Array.from(previewImages) : [];

    const onSubmit = async (data) => {
        const { password, confirmPassword } = data;
        console.log(data);
        if (password !== confirmPassword) {
            toast.error('Password and confirm password must be the same');
            return;
        }
        setLoading(true);
        toast.loading('Registering...');
        try {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                if (key === 'confirmPassword' || key === 'checked') return;
                if (key === 'image') {
                    formData.append(key, data[key][0]);
                } else if (key === 'previewImages') {
                    Array.from(data[key]).forEach((image) => {
                        formData.append('previewImages', image);
                    });
                } else {
                    formData.append(key, data[key]);
                }
            });

            const res = await registerAdminFromCompany(formData);
            console.log(res);
            const resData = res.data;
            toast.dismiss();
            toast.success('Register successfully');
            reset();
            navigate(ENDPOINT.VALIDATE_COMPANY, {
                state: {
                    resData,
                },
            });
        } catch (err) {
            console.log(err);
            toast.dismiss();
            toast.error(err.response.data.message ?? 'Register failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles.wrapper}>
                <img
                    src={Logo}
                    className={styles.logo}
                    alt={'Logo'}
                    onClick={() => navigate(ENDPOINT.AUTHENTICATION)}
                />
                <h2>Register your company</h2>
                <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <p>Company logo</p>
                        <label htmlFor="image" style={styles.label}>
                            <img
                                src={isImageUploaded ? URL.createObjectURL(image[0]) : Camera}
                                alt="Camera"
                            />
                            <Controller
                                control={control}
                                name="image"
                                rules={{ required: 'Company logo is required' }}
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
                                    previewImagesArray.map((image) => (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="preview"
                                            key={image.lastModified + image.name}
                                            className={styles.previewImage}
                                        />
                                    ))}
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
                                    />
                                )}
                            />
                            {errors.name && <p className={styles.error}>{errors.name.message}</p>}
                        </label>
                        {/* <label
                        htmlFor="email"
                        className={styles.label}
                        style={{
                            width: 400,
                        }}
                    >
                        <p>Company email</p>
                        <Controller
                            control={control}
                            name="email"
                            rules={{ required: 'Company email is required' }}
                            render={({ field: { value, onChange, ...field } }) => (
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    placeholder="example@mail.com"
                                    size="medium"
                                    fullWidth
                                />
                            )}
                        />
                    </label> */}
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
                                    />
                                )}
                            />
                            {errors.address && (
                                <p className={styles.error}>{errors.address.message}</p>
                            )}
                        </label>
                        <div
                            style={{
                                border: '1px solid #000',
                                padding: '1rem',
                                borderRadius: '1rem',
                            }}
                        >
                            <label
                                htmlFor="username"
                                className={styles.label}
                                style={{
                                    width: 400,
                                }}
                            >
                                <p>Administrator username</p>
                                <Controller
                                    control={control}
                                    name="username"
                                    rules={{
                                        required: 'Username is required',
                                        validate: (value) => {
                                            if (value.length < 6) {
                                                return 'Username must be at least 6 characters';
                                            }
                                            const regex = /^[a-z0-9]+$/;
                                            if (!regex.test(value)) {
                                                return 'Username must be alphanumeric';
                                            }
                                        },
                                    }}
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <Input
                                            id="username"
                                            type="text"
                                            {...register('username')}
                                            placeholder="etour_admin"
                                            size="medium"
                                            fullWidth
                                            error={!!errors.username}
                                        />
                                    )}
                                />
                                {errors.username && (
                                    <p className={styles.error}>{errors.username.message}</p>
                                )}
                            </label>

                            <label
                                htmlFor="password"
                                className={styles.label}
                                style={{
                                    width: 400,
                                }}
                            >
                                <p>Administrator password</p>
                                <Controller
                                    control={control}
                                    name="password"
                                    rules={{
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters',
                                        },
                                    }}
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <Input
                                            id="password"
                                            type="password"
                                            {...register('password')}
                                            placeholder="********"
                                            size="medium"
                                            fullWidth
                                            error={!!errors.password}
                                        />
                                    )}
                                />
                                {errors.password && (
                                    <p className={styles.error}>{errors.password.message}</p>
                                )}
                            </label>
                            <label
                                htmlFor="confirmPassword"
                                className={styles.label}
                                style={{
                                    width: 400,
                                }}
                            >
                                <p>Confirm password</p>
                                <Controller
                                    control={control}
                                    name="confirmPassword"
                                    rules={{
                                        required: 'Confirm password is required',
                                        validate: (value) =>
                                            value === watch('password') || 'Passwords do not match',
                                    }}
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            {...register('confirmPassword')}
                                            placeholder="********"
                                            size="medium"
                                            fullWidth
                                            error={!!errors.confirmPassword}
                                        />
                                    )}
                                />
                                {errors.confirmPassword && (
                                    <p className={styles.error}>{errors.confirmPassword.message}</p>
                                )}
                            </label>
                            <label
                                htmlFor="email"
                                className={styles.label}
                                style={{
                                    width: 400,
                                }}
                            >
                                <p>Administrator email</p>
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{ required: 'Email is required' }}
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register('email')}
                                            placeholder="example@mail.com"
                                            size="medium"
                                            fullWidth
                                            error={!!errors.email}
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <p className={styles.error}>{errors.email.message}</p>
                                )}
                            </label>
                        </div>
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
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={disabledSubmit || loading}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default RegisterPage;
