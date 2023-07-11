import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ValidateCompanyPage.module.scss';
import { ReactComponent as SHIELD_CHECK } from '@/assets/shield-check.svg';
import { Button } from '@mui/material';
import ENDPOINT from '@/constant/endponint';
const ValidateCompanyPage = () => {
    const { state } = useLocation();
    const data = state?.resData;
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            const datacolors = document.querySelectorAll('[data-color]');
            datacolors.forEach((datacolor, index) => {
                const color = datacolor.getAttribute('data-color');
                datacolor.style.backgroundColor = color;
                if (index === 2) {
                    datacolor.style.width = `30px`;
                    datacolor.style.height = `30px`;
                    datacolor.style.transform = `translateY(-6px) translateX(-50%)`;
                }
                const p = datacolor.parentNode.childNodes[1];
                p.style.color = color;
            });
        }
    }, [data]);

    const onPressSignIn = () => {
        localStorage.clear();
        const tokens = data.tokens;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        navigate(ENDPOINT.HOME);
    };

    return (
        <div className={styles.container}>
            <h2
                style={{
                    textAlign: 'center',
                }}
            >
                {data
                    ? 'Validating your company...'
                    : "You don't have permission to access this page! Please register to access this page"}
            </h2>
            {!data && (
                <div className={styles.unregister}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(ENDPOINT.REGISTER)}
                        fullWidth
                    >
                        Register now
                    </Button>
                    <p>or</p>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(ENDPOINT.HOME)}
                        fullWidth
                    >
                        Back to homepage
                    </Button>
                </div>
            )}
            {data && (
                <div className={styles.grid}>
                    <div>
                        <SHIELD_CHECK />
                        <p>Your administrator account has been created successfully</p>
                        <Button variant="contained" color="primary" onClick={onPressSignIn}>
                            Sign in with administrator account
                        </Button>
                    </div>
                    <div>
                        <p>
                            Your company is being validated, we will send notification email to you
                            when it is completed
                        </p>
                        <div className={styles.timeline}>
                            <div className={styles.line} />
                            <div data-state="complete">
                                <div className={styles.circle} data-color="#00B707" />
                                <p>Create administrator account</p>
                            </div>
                            <div data-state="complete">
                                <div className={styles.circle} data-color="#00B707" />
                                <p>Send your registration</p>
                            </div>
                            <div data-state="validating">
                                <div className={styles.circle} data-color="#00a3ff" />
                                <p>Validating your company</p>
                            </div>
                            <div data-state="processing">
                                <div className={styles.circle} data-color="#D9D9D9" />
                                <p>Setup your company</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValidateCompanyPage;
