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
}) {
	return (
		<button
			type="button"
			style={{
				width: fullWidth ? "100%" : "max-content",
				backgroundColor,
				color,
				...style,
			}}
			className={styles.container}
			onClick={onClick}
		>
			{Icon ? <Icon fill={color} /> : null}
			<p style={{ color }}> {children}</p>
		</button>
	);
}
