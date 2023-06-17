import { useParams } from "react-router-dom";
import { ReactComponent as EDIT_ICON } from "../../assets/edit.svg";
import { API_ENDPOINT } from "../../constant/api";
import COLORS from "../../constant/color";
import useTourById from "../../hooks/tour/useTourById";
import styles from "./DetailTourPage.module.scss";
import ImageButton from "../../components/ImageButton/ImageButton";
import EditTourModal, {
	useEditTourModalState,
} from "../../components/EditTourModal/EditTourModal";
import moment from "moment";

export default function DetailTourPage() {
	const { id } = useParams();

	const { data } = useTourById(id);

	const { modalState: editTourModalState, openModal } =
		useEditTourModalState(id);

	return (
		<>
			<div className={styles.container}>
				<h1 className={styles.pageTitle}>Tour detail</h1>
				<div className={styles.header}>
					{data?.image ? (
						<img src={`${API_ENDPOINT.IMAGE}/${data.image}`} />
					) : null}
					<p className={styles.title}>Tour name</p>
					<h1 className={styles.tourName}>{data?.name}</h1>
					<p>{moment(data?.from).format("h:mm:ss a, DD MMMM YYYY")}</p>
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
							position: "absolute",
							top: 330,
							right: 30,
							padding: "20px 15px 20px 30px",
						}}
					>
						{""}
					</ImageButton>
				</div>
			</div>
			<EditTourModal {...editTourModalState} />
		</>
	);
}
