import { Outlet } from "react-router-dom";
import useAuthenticationNavigate from "../../hooks/useAuthenticationNavigate";

export default function BasePage() {
	useAuthenticationNavigate();

	return <Outlet />;
}
