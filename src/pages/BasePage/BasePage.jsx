import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuthenticationNavigate from "../../hooks/useAuthenticationNavigate";
import { setBasicInformation } from "../../features/staffSlice";
import useStaffInformation from "../../hooks/useStaffInformation";

export default function BasePage() {
	useAuthenticationNavigate();

	const dispatch = useDispatch();
	const { data, isError, error } = useStaffInformation();

	useEffect(() => {
		if (data) dispatch(setBasicInformation(data));
	}, [data]);

	return <Outlet />;
}
