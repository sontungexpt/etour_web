import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
	Button,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import CHEVRON from "../../assets/chevron-down.svg";
import CLOSE from "../../assets/close.svg";
import SEARCH from "../../assets/search.svg";
import ROUTE from "../../assets/taxi.svg";
import COLORS from "../../constant/color";

import { toast } from "react-toastify";
import CenteredModal from "../../components/CenteredModal/CenteredModal";
import RouteList from "../../components/RouteList/RouteList";
import useCreateRoute from "../../hooks/useCreateRoute";
import usePersistentState from "../../hooks/usePersistentState";
import useTouristRoute from "../../hooks/useTouristRoute";
import styles from "./DetailRoutePage.module.scss";
import useTourByRouteId from "../../hooks/useTourByRouteId";

export default function DetailRoutePage() {
	const { id } = useParams();

	const { data, isError, error } = useTourByRouteId(id);

	console.log({ data, isError, error });

	return <div>{id}</div>;
}
