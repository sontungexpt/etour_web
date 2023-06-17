import COLORS from '@/constant/color';
import PropTypes from 'prop-types';
import styles from './NavigationButton.module.scss';

import { ReactComponent as HOME_ICON } from '@/assets/home.svg';

export default function NavigationButton({
    icon: Icon,
    children,
    isHighlighted = false,
    onClick = () => {},
    style = {},
}) {
    return (
        <button
            className={`${styles.container} ${isHighlighted ? styles.highlight : null}`}
            type="button"
            style={style}
            onClick={onClick}
        >
            <Icon fill={isHighlighted ? 'white' : COLORS.navButton} />
            <p> {children}</p>
        </button>
    );
}

NavigationButton.propTypes = {
    style: PropTypes.object,
    onClick: PropTypes.func,
    /**
     * Content of button
     */
    children: PropTypes.any,
    /**
     * Button icon
     */
    icon: PropTypes.any,
    /**
     * Indicate whether the current is being selected
     */
    isHighlighted: PropTypes.bool,
};

NavigationButton.defaultProps = {
    children: 'Navigation tab',
    icon: HOME_ICON,
    onClick: () => {},
    isHighlighted: false,
};
