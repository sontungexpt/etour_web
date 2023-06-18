import { useParams } from 'react-router-dom';
import { ReactComponent as EDIT_ICON } from '@/assets/edit.svg';
import { API_ENDPOINT } from '@/constant/api';
import COLORS from '@/constant/color';
import useTourById from '@/hooks/tour/useTourById';
import styles from './DetailTourPage.module.scss';
import ImageButton from '@/components/ImageButton/ImageButton';
import EditTourModal, { useEditTourModalState } from '@/components/EditTourModal/EditTourModal';
import moment from 'moment';
import PageTitle from '@/components/PageTitle/PageTitle';

import { ReactComponent as ADD_ICON } from '@/assets/add.svg';
import { ReactComponent as EXPAND_ICON } from '@/assets/expand.svg';
import useTourNotification from '@/hooks/notification/useTourNotification';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import EditNotificationModal, {
    useEditNotificationState,
} from '@/components/EditNotificationModal/EditNotificationModal';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function DetailTourPage() {
    const { id } = useParams();

    const { data } = useTourById(id);
    const { data: notifications } = useTourNotification(id);

    const { modalState, openModal: openEditNotificationModal } = useEditNotificationState(id);

    const { modalState: editTourModalState, openModal } = useEditTourModalState(id);

    return (
        <>
            <div className={styles.container}>
                {/* <h1 className={styles.pageTitle}>Tour detail</h1> */}
                <PageTitle>Tour detail</PageTitle>
                <div className={styles.header}>
                    {data?.image ? <img src={`${API_ENDPOINT.IMAGE}/${data.image}`} /> : null}
                    <p className={styles.title}>Tour name</p>
                    <h1 className={styles.tourName}>{data?.name}</h1>
                    <p>{moment(data?.from).format('h:mm:ss a, DD MMMM YYYY')}</p>
                    <p className={styles.title}>Description</p>
                    <p>{data?.description}</p>
                    <p className={styles.title}>Tour type</p>
                    <p>{data?.type} </p>
                    <ImageButton
                        onClick={() => openModal(data)}
                        backgroundColor={COLORS.lightEditBackground}
                        color={COLORS.editBackground}
                        icon={EDIT_ICON}
                        style={{
                            position: 'absolute',
                            top: 330,
                            right: 30,
                            padding: '20px 15px 20px 30px',
                        }}
                    >
                        {''}
                    </ImageButton>
                </div>
                <div className={styles.notification}>
                    <h1>Notification list</h1>
                    <ImageButton
                        icon={ADD_ICON}
                        color={COLORS.editBackground}
                        backgroundColor={COLORS.lightEditBackground}
                        onClick={() => openEditNotificationModal({})}
                        fullWidth
                    >
                        Add notification
                    </ImageButton>
                    <div className={styles['notification-list']}>
                        {notifications.map((notification) => (
                            <Accordion fullWidth>
                                <AccordionSummary
                                    expandIcon={<EXPAND_ICON />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        {notification?.title}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>
                                        {moment(notification?.createdAt).format(
                                            'DD MMMM YYYY, h:mm:ss a'
                                        )}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>{notification?.content}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>
                </div>
            </div>
            <EditNotificationModal {...modalState} />
            <EditTourModal {...editTourModalState} />
        </>
    );
}
