import { useNavigate } from "react-router-dom";
import HERO_IMAGE from "../../assets/hero.svg";
import ARROW from "../../assets/arrow.svg";
import styles from "./OnBoardingPage.module.scss";
import ENDPOINT from "../../constant/endponint";

export default function OnBoardingPage() {
	const navigate = useNavigate();

	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<h1>
					Welcome to <br /> E-tour Business
				</h1>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
					enim ad minim veniam, quis nostrud exercitation u
				</p>
				<a
					onClick={(e) => {
						e.preventDefault();
						navigate(ENDPOINT.AUTHENTICATION);
					}}
				>
					<p>Get started</p>
					<img src={ARROW} />
				</a>
			</div>
			<img src={HERO_IMAGE} />
		</div>
	);
}
