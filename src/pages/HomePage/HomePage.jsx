import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.scss";
import { useEffect } from "react";
import ENDPOINT from "../../constant/endponint";

export default function HomePage() {
	const navigate = useNavigate();

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		if (!accessToken) navigate(ENDPOINT.ON_BOARDING);
	}, []);

	return <div className={styles.container}></div>;
}
