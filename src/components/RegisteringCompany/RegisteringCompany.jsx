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
import useCompanyInformation from '@/hooks/useCompanyInformation';

const RegisteringCompany = () => {
    const navigate = useNavigate();
    const { socket, setSocket } = useContext(SocketContext);
    const dispatch = useDispatch();
    const { data: companyData } = useCompanyInformation();

    const onPressLogOut = () => {
        localStorage.clear();
        navigate(ENDPOINT.ON_BOARDING);
        toast('Sign out successfully');
        socket && socket.disconnect();
        setSocket(null);
        dispatch(afterSignOut());
    };

    const profileState = companyData?.profileState;

    return (
        <div className={styles.container}>
            <h2>Your company’s registration is being reviewed</h2>
            <div>
                <div>
                    <Check />
                    <p
                        style={{
                            color: '#00B707',
                        }}
                    >
                        Company information
                    </p>
                </div>
                <div>
                    <Cross />
                    <p
                        style={{
                            color: '#FF3737',
                        }}
                    >
                        Confirmed company email
                    </p>
                </div>
                <div>
                    <Check />
                    <p
                        style={{
                            color: '#00B707',
                        }}
                    >
                        Confirmed administrator email
                    </p>
                </div>
                <div>
                    {profileState === 'pending' && (
                        <div className={styles.dots}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    )}
                    {profileState === 'rejected' && <Cross />}
                    <p
                        style={{
                            color: profileState === 'pending' ? '#FFC000' : '#FF3737',
                        }}
                    >
                        {profileState === 'pending'
                            ? 'Being reviewed by E-Tour'
                            : 'Your company registration is rejected'}
                    </p>
                </div>
            </div>
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(ENDPOINT.UPDATE_REGISTER)}
                >
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
