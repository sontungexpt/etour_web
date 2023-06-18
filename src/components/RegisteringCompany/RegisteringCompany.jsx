import React from 'react';
import { ReactComponent as Check } from '@/assets/check.svg';
import { ReactComponent as Cross } from '@/assets/cross.svg';
import { ReactComponent as MenuDots } from '@/assets/menu-dots.svg';
import styles from './RegisteringCompany.module.scss';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ENDPOINT from '@/constant/endponint';

const RegisteringCompany = () => {
    const navigate = useNavigate();
    const onPressLogOut = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refresshToken');
        navigate(ENDPOINT.ON_BOARDING);
        toast('Sign out successfully');
    };

    return (
        <div className={styles.container}>
            <h2>Your company’s registration is being reviewed</h2>
            <div>
                <div>
                    <Check />
                    <p>Company information</p>
                </div>
                <div>
                    <Cross />
                    <p>Confirmed company email</p>
                </div>
                <div>
                    <Check />
                    <p>Confirmed administrator email</p>
                </div>
                <div>
                    <div className={styles.dots}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <p>Being reviewed by E-Tour</p>
                </div>
            </div>
            <div>
                <Button variant="contained" color="primary">
                    Modify registration
                </Button>
                <Button variant="contained" color="error" fullWidth onClick={onPressLogOut}>
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default RegisteringCompany;
