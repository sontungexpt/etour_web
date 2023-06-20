import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@/components/Card/Card';
import ImageButton from '@/components/ImageButton/ImageButton';
import AUTHENTICATION_STATE from '@/constant/authenticationState';
import COLORS from '@/constant/color';
import ENDPOINT from '@/constant/endponint';
import useAuthenticationState from '@/hooks/useAuthenticationState';
import useCompanyInformation from '@/hooks/useCompanyInformation';
import useStaffInformation from '@/hooks/staff/useStaffInformation';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import styles from './HomePage.module.scss';

import { ReactComponent as EDIT_ICON } from '@/assets/edit.svg';
import { ReactComponent as SIGN_OUT_ICON } from '@/assets/sign-out.svg';
import { ReactComponent as BUG } from '@/assets/bug.svg';
import { avatarStorage } from '@/lib/image';
import SocketContext from '@/contexts/SocketContext';
import { useDispatch } from 'react-redux';
import { afterSignOut } from '@/features/staffSlice';
import { API_ENDPOINT } from '@/constant/api';
import { randomUUID } from '@/lib/operation';
import EditCompanyModal, {
    useEditCompanyModalState,
} from '@/components/EditCompanyModal/EditCompanyModal';
import AddStaffModal, { useAddStaffState } from '@/components/AddStaffModal/AddStaffModal';
import useStaffPermission from '@/hooks/staff/useStaffPermission';
import { StaffPermission } from '@/constant/staffPermission.ts';
import apiInstance from '@/api/instance';

export default function HomePage() {
    const navigate = useNavigate();
    const authenticationState = useAuthenticationState();

    const [staffList, setStaffList] = useState([]);

    const { data, isError, error } = useStaffInformation();
    const { hasPermission } = useStaffPermission();
    const { data: companyData, companyIsError, companyError } = useCompanyInformation();
    const { socket, setSocket } = useContext(SocketContext);

    const { modalState: addStaffModalState, openModal: openAddStaffModal } = useAddStaffState({
        onUpdate: (newData, type) => {
            if (type == 'delete') {
                setStaffList((prev) => [...prev.filter((d) => d._id != newData._id)]);
            } else
                setStaffList((prev) =>
                    [...prev.filter((d) => d._id != newData._id), newData].sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                );
        },
    });
    const { modalState: editCompanyModalState, openModal: openEditCompanyModal } =
        useEditCompanyModalState(companyData);

    useEffect(() => {
        if (authenticationState == AUTHENTICATION_STATE.UNAUTHENTICATED)
            navigate(ENDPOINT.ON_BOARDING);
    }, []);

    useEffect(() => {
        async function execute() {
            const res = await apiInstance.get(API_ENDPOINT.STAFF);
            if (res.status == 200) {
                setStaffList(res.data.data);
            } else {
                toast.error(`Fail to get staff list: ${res.data.message}`, {
                    position: 'bottom-left',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }
        }
        execute();
    }, []);

    const dispatch = useDispatch();

    const handleOnPressSignOut = () => {
        localStorage.clear();
        navigate(ENDPOINT.ON_BOARDING);
        toast('Sign out successfully');
        socket && socket.disconnect();
        setSocket(null);
        dispatch(afterSignOut());
        if (window) {
            window.location.reload(false);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.main}>
                    <h1>Hello {data?.fullName}, welcome to E-Tour Business</h1>
                    <div className={styles.dashboard}>
                        <div>
                            <Card
                                backgroundColor="white"
                                style={{
                                    boxShadow: '0 0 15px 0 #d8d4e5',
                                }}
                            >
                                <div className={styles.box}>
                                    <h2>Company staff</h2>
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
                                    <div>
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
                                        <ImageButton
                                            icon={BUG}
                                            onClick={() => navigate(ENDPOINT.REPORT)}
                                            color={COLORS.delete}
                                            style={{
                                                marginTop: '1rem',
                                            }}
                                            fullWidth
                                        >
                                            Report an issue
                                        </ImageButton>
                                    </div>
                                </div>
                            </Card>
                            <Card
                                backgroundColor="white"
                                style={{
                                    boxShadow: '0 0 15px 0 #d8d4e5',
                                    marginTop: 50,
                                    width: '100%',
                                }}
                            >
                                <div className={styles.box}>
                                    <h2>Staff information</h2>
                                    <ImageButton
                                        hidden={!hasPermission(StaffPermission.ADD_STAFF)}
                                        color={COLORS.greenPastelPrimary}
                                        backgroundColor={COLORS.greenPastelSecondary}
                                        onClick={openAddStaffModal}
                                        style={{
                                            position: 'absolute',
                                            top: 15,
                                            right: 25,
                                            padding: '20px 15px 20px 25px',
                                        }}
                                    >
                                        {''}
                                    </ImageButton>
                                    <div className={styles.staffList}>
                                        {staffList.map((staff) => (
                                            <div
                                                key={`${staff.fullName} ${staff.role}`}
                                                onClick={() => openAddStaffModal(staff)}
                                                className={styles.staff}
                                            >
                                                <p>{staff?.fullName}</p>
                                                <p>{staff?.role}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>
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
                                    {companyData &&
                                        companyData?.previewImages.map((image) => (
                                            <img
                                                src={`${API_ENDPOINT.IMAGE}/${image}`}
                                                key={image + randomUUID()}
                                            />
                                        ))}
                                </div>
                            </div>
                            <div className={styles.companyProfileButton}>
                                <ImageButton
                                    hidden={!hasPermission(StaffPermission.EDIT_COMPANY)}
                                    color={COLORS.editBackground}
                                    backgroundColor={COLORS.lightEditBackground}
                                    icon={EDIT_ICON}
                                    onClick={() => openEditCompanyModal(companyData)}
                                >
                                    Edit company
                                </ImageButton>
                                <ImageButton
                                    hidden={!hasPermission(StaffPermission.ADD_STAFF)}
                                    color={COLORS.greenPastelPrimary}
                                    backgroundColor={COLORS.greenPastelSecondary}
                                    onClick={openAddStaffModal}
                                >
                                    Add new staff
                                </ImageButton>
                            </div>
                        </div>
                    </div>
                </div>

                <EditCompanyModal {...editCompanyModalState} />
                <AddStaffModal {...addStaffModalState} />
            </div>
        </>
    );
}
