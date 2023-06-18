import { useNavigate } from 'react-router-dom';

import { ReactComponent as BACK_ICON } from '../../assets/chevron.svg';

import styles from './PageTitle.module.scss';
import ImageButton from '../ImageButton/ImageButton';
import COLORS from '../../constant/color';

export default function PageTitle({ children }) {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <a onClick={() => navigate(-1)}>{'< Back'}</a>
            <h1 className={styles.container}>{children}</h1>
        </div>
    );
}
