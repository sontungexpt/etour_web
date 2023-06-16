import COLORS from "../../constant/color";
import styles from "./ImageButton.module.scss";

export default function ImageButton({
	fullWidth,
	backgroundColor = "white",
	color = COLORS.primary,
	style = {},
	onClick = () => {},
	children,
	icon: Icon,
	disabled = false,
}) {
	return (
		<button
			type="button"
			disabled={disabled}
			style={{
				width: fullWidth ? "100%" : "max-content",
				backgroundColor: disabled
					? COLORS.disabledBackground
					: backgroundColor,
				color: disabled ? COLORS.disabled : color,
				...style,
			}}
			className={`${styles.container} ${disabled ? styles.disabled : ""}`}
			onClick={onClick}
		>
			{Icon ? <Icon fill={disabled ? COLORS.disabled : color} /> : null}
			<p style={{ color: disabled ? COLORS.disabled : color }}>{children}</p>
		</button>
	);
}
