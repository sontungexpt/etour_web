import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@/components/Card/Card';
import ImageButton from '@/components/ImageButton/ImageButton';
import AUTHENTICATION_STATE from '@/constant/authenticationState';
import COLORS from '@/constant/color';
import ENDPOINT from '@/constant/endponint';
import useAuthenticationState from '@/hooks/useAuthenticationState';
import useCompanyInformation from '@/hooks/useCompanyInformation';
import useStaffInformation from '@/hooks/useStaffInformation';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import styles from './HomePage.module.scss';

import { ReactComponent as EDIT_ICON } from '@/assets/edit.svg';
import { ReactComponent as SIGN_OUT_ICON } from '@/assets/sign-out.svg';
import { avatarStorage } from '@/lib/image';
import SocketContext from '@/contexts/SocketContext';
import { useDispatch } from 'react-redux';
import { afterSignOut } from '@/features/staffSlice';
import { API_ENDPOINT } from '@/constant/api';

export default function HomePage() {
    const navigate = useNavigate();
    const authenticationState = useAuthenticationState();

    const { data, isError, error } = useStaffInformation();
    const { data: companyData, companyIsError, companyError } = useCompanyInformation();
    const { socket, setSocket } = useContext(SocketContext);

    useEffect(() => {
        if (authenticationState == AUTHENTICATION_STATE.UNAUTHENTICATED)
            navigate(ENDPOINT.ON_BOARDING);
    }, []);

    const dispatch = useDispatch();

    const handleOnPressSignOut = () => {
        localStorage.clear();
        navigate(ENDPOINT.ON_BOARDING);
        toast('Sign out successfully');
        socket && socket.disconnect();
        setSocket(null);
        dispatch(afterSignOut());
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.main}>
                    <h1>Hello {data?.fullName}, welcome to E-Tour Business</h1>
                    <div className={styles.dashboard}>
                        <Card
                            backgroundColor="white"
                            style={{
                                boxShadow: '0 0 15px 0 #d8d4e5',
                            }}
                        >
                            <div className={styles.box}>
                                <h2>Staff information</h2>
                                <div className={styles.staffBasicInfo}>
                                    <img
                                        src={avatarStorage(data?.image || '')}
                                        alt={data?.fullName}
                                    />
                                    <div>
                                        <p>{data?.fullName}</p>
                                        <p>{data?.role}</p>
                                    </div>
                                </div>
                                <div className={styles.permission}>
                                    <p>Permissions</p>
                                    <ul>
                                        {data?.permissions?.map((permission) => (
                                            <li key={permission}>{permission}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={styles.functionBox}>
                                    <ImageButton
                                        onClick={() => {}}
                                        icon={EDIT_ICON}
                                        backgroundColor={COLORS.editBackground}
                                        color={COLORS.edit}
                                    >
                                        Edit profile
                                    </ImageButton>
                                    <ImageButton
                                        onClick={handleOnPressSignOut}
                                        icon={SIGN_OUT_ICON}
                                        backgroundColor={COLORS.deleteBackground}
                                        color={COLORS.delete}
                                    >
                                        Sign out
                                    </ImageButton>
                                </div>
                            </div>
                        </Card>
                        <div className={styles.box}>
                            <h2>Company information</h2>
                            <div className={styles.companyBasicInfo}>
                                <img
                                    src={avatarStorage(companyData?.image || '')}
                                    alt={data?.fullName}
                                />
                                <div className={styles.companyName}>
                                    <p className={styles.title}>Company name</p>
                                    <h1>{companyData?.name}</h1>
                                </div>
                                <div className={styles.email}>
                                    <p className={styles.title}>Email</p>
                                    <p>{companyData?.email}</p>
                                </div>
                                <div className={styles.description}>
                                    <p className={styles.title}>Description</p>
                                    <p className={styles.description}>{companyData?.description}</p>
                                </div>
                                <p className={styles.title}>Preview images</p>
                                <div className={styles.images}>
                                    {companyData.previewImages.map((image) => (
                                        <img src={`${API_ENDPOINT.IMAGE}/${image}`} />
                                    ))}
                                </div>
                            </div>
                            <ImageButton
                                color={COLORS.editBackground}
                                backgroundColor={COLORS.lightEditBackground}
                                icon={EDIT_ICON}
                            >
                                Edit company
                            </ImageButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
