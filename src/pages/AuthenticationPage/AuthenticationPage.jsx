import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import ENDPOINT from '@/constant/endponint';
import useAuthenticationState from '@/hooks/useAuthenticationState';
import AUTHENTICATION_STATE from '@/constant/authenticationState';
import HERO_IMAGE from '@/assets/authentication-hero.svg';

import styles from './AuthenticationPage.module.scss';
import COLORS from '@/constant/color';
import axios from 'axios';
import { API_ENDPOINT } from '@/constant/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setBasicInformation } from '@/features/staffSlice';

export default function AuthenticationPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const authenticationState = useAuthenticationState();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (authenticationState == AUTHENTICATION_STATE.AUTHENTICATED) navigate(ENDPOINT.HOME);
    }, []);

    async function handleSignIn() {
        async function submitCredential() {
            const response = await axios.post(API_ENDPOINT.LOGIN, {
                username,
                password,
            });
            const data = response.data.data;
            const { accessToken, refreshToken } = data.tokens;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // localStorage.setItem("staff", JSON.stringify(data.staff));
            dispatch(setBasicInformation(data.staff));

            navigate(ENDPOINT.HOME);
        }
        toast.promise(submitCredential(), {
            pending: 'Submitting your credential',
            success: 'Login successfully',
            error: 'Failed to login',
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <h1>Sign in with your staff account</h1>
                <Box
                    component="form"
                    sx={{
                        width: '100%',
                        // height: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '30px',
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="username"
                        id="outlined-basic"
                        label="Username"
                        variant="outlined"
                        sx={{ backgroundColor: 'white', width: '100%' }}
                    />
                    <TextField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        sx={{ backgroundColor: 'white', width: '100%' }}
                    />
                </Box>
                <Button
                    onClick={handleSignIn}
                    variant="contained"
                    sx={{
                        backgroundColor: COLORS.primary,
                        borderRadius: '8px',
                        padding: '8px',
                    }}
                >
                    <p className={styles.signin}>Sign in</p>
                </Button>
                <p className={styles.note}>
                    Start your business with us{' '}
                    <span
                        onClick={() => {
                            navigate(ENDPOINT.REGISTER);
                        }}
                    >
                        here
                    </span>
                </p>
            </div>

            <img src={HERO_IMAGE} />
        </div>
    );
}
