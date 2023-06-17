import { useParams } from "react-router-dom";
import { ReactComponent as EDIT_ICON } from "../../assets/edit.svg";
import { API_ENDPOINT } from "../../constant/api";
import COLORS from "../../constant/color";
import useTourById from "../../hooks/tour/useTourById";
import styles from "./DetailTourPage.module.scss";
import ImageButton from "../../components/ImageButton/ImageButton";

export default function DetailTourPage() {
	const { id } = useParams();

	const { data } = useTourById(id);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				{data?.image ? (
					<img src={`${API_ENDPOINT.IMAGE}/${data.image}`} />
				) : null}
				<p className={styles.title}>Tourist route name</p>
				<h1>{data?.name}</h1>
				<p className={styles.title}>Description</p>
				<p>{data?.description}</p>
				<p className={styles.title}>Tour type</p>
				<p>{data?.type} </p>
				<ImageButton
					// onClick={() => openModal(data)}
					backgroundColor={COLORS.lightEditBackground}
					color={COLORS.editBackground}
					icon={EDIT_ICON}
					style={{
						position: "absolute",
						top: 330,
						right: 30,
					}}
				>
				Edit
				</ImageButton>
			</div>
		</div>
	);
}
