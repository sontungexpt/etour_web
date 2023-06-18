import React, { useContext } from 'react';
import { ReactComponent as Check } from '@/assets/check.svg';
import { ReactComponent as Cross } from '@/assets/cross.svg';
import { ReactComponent as MenuDots } from '@/assets/menu-dots.svg';
import styles from './RegisteringCompany.module.scss';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ENDPOINT from '@/constant/endponint';
import SocketContext from '@/contexts/SocketContext';
import { afterSignOut } from '@/features/staffSlice';
import { useDispatch } from 'react-redux';

const RegisteringCompany = () => {
    const navigate = useNavigate();
    const { socket, setSocket } = useContext(SocketContext);
    const dispatch = useDispatch();

    const onPressLogOut = () => {
        localStorage.clear();
        navigate(ENDPOINT.ON_BOARDING);
        toast('Sign out successfully');
        socket && socket.disconnect();
        setSocket(null);
        dispatch(afterSignOut());
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
