import COLORS from "../../constant/color";
import styles from "./NavigationButton.module.scss";

export default function NavigationButton({
	icon: Icon,
	children,
	isHighlighted = false,
	onClick = () => {},
	style = {},
}) {
	return (
		<button
			className={`${styles.container} ${
				isHighlighted ? styles.highlight : null
			}`}
			type="button"
			style={style}
			onClick={onClick}
		>
			<Icon fill={isHighlighted ? "white" : COLORS.navButton} />
			<p> {children}</p>
		</button>
	);
}
