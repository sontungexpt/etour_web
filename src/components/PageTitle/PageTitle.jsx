import { useNavigate } from 'react-router-dom';

import { ReactComponent as BACK_ICON } from '../../assets/chevron.svg';

import styles from './PageTitle.module.scss';
import ImageButton from '../ImageButton/ImageButton';
import COLORS from '../../constant/color';

export default function PageTitle({ children }) {
    const navigate = useNavigate();

    const onPressBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.container}>
            {/* <BACK_ICON fill="#00171F" /> */}
            {/* <ImageButton
				icon={BACK_ICON}
				color={COLORS.editBackground}
				backgroundColor={COLORS.lightEditBackground}
            style={{
               padding: '15px 30px'
            }}
			>
				Back
			</ImageButton> */}
            <div data-href="back" role="button" onClick={onPressBack}>
                {'< Back'}
            </div>
            <h1 className={styles.container}>{children}</h1>
        </div>
    );
}
