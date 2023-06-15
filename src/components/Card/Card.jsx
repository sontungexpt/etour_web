import styles from "./Card.module.scss";

export default function Card({
	width,
	backgroundColor = "white",
	children,
	style = {},
	onClick,
}) {
	return (
		<div
			className={styles.container}
			style={{
				cursor: onClick ? "pointer" : "default",
				width,
				backgroundColor,
				...style,
			}}
		>
			{children}
		</div>
	);
}
