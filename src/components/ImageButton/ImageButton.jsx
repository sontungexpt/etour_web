import COLORS from '@/constant/color';
import PropTypes from 'prop-types';
import styles from './ImageButton.module.scss';

import { ReactComponent as ADD_ICON } from '@/assets/add.svg';

export default function ImageButton({
    fullWidth,
    backgroundColor = 'white',
    color = COLORS.primary,
    style = {},
    onClick = () => {},
    children = 'Button',
    icon: Icon,
    disabled = false,
    reversed = false,
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            style={{
                width: fullWidth ? '100%' : 'max-content',
                backgroundColor: disabled ? COLORS.disabledBackground : backgroundColor,
                color: disabled ? COLORS.disabled : color,
                flexDirection: reversed ? 'row-reverse' : 'row',
                ...style,
            }}
            className={`${styles.container} ${disabled ? styles.disabled : ''}`}
            onClick={onClick}
        >
            {Icon ? <Icon fill={disabled ? COLORS.disabled : color} /> : null}
            <p style={{ color: disabled ? COLORS.disabled : color }}>{children}</p>
        </button>
    );
}

ImageButton.propTypes = {
    /**
     * Is the button stretch full width
     */
    fullWidth: PropTypes.bool,
    /**
     * Background color of button
     */
    backgroundColor: PropTypes.string,
    /**
     * Text color of button
     */
    color: PropTypes.string,
    /**
     * Custom style of button
     */
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
    disabled: PropTypes.bool,
    /**
     * If reversed = false, he button icon will be displayed in front of text, else
     */
    reversed: PropTypes.bool,
};

ImageButton.defaultProps = {
    backgroundColor: 'white',
    color: COLORS.primary,
    style: {},
    onClick: () => {},
    children: 'Button',
    icon: ADD_ICON,
    disabled: false,
    reversed: false,
};
