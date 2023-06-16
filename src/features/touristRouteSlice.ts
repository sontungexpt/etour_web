import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { deleteTouristRouteAPI } from "../api/touristRoute";
import { STATUS } from "../constant/status";

const initialState = {
	routes: [],
	getListTouristRouteError: "",
	deleteStatus: "",
};

export const deleteTouristRoutes = createAsyncThunk(
	"touristRoute/delete",
	async (ids: string[]) => {
		const results = await Promise.all(
			ids.map(async (id) => await deleteTouristRouteAPI(id))
		);
		return results;
	}
);

export const touristRouteSlice = createSlice({
	name: "touristRoute",
	initialState,
	reducers: {
		setRoutes(state, action) {
			state.routes = action.payload;
		},
		setGetListTouristRouteError(state, action) {
			state.getListTouristRouteError = action.payload.error;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(deleteTouristRoutes.pending, (state, action) => {
			state.deleteStatus = STATUS.PENDING;
		});
		builder.addCase(deleteTouristRoutes.fulfilled, (state) => {
			state.deleteStatus = STATUS.SUCCESS;
		});
		builder.addCase(deleteTouristRoutes.rejected, (state) => {
			state.deleteStatus = STATUS.FAIL;
		});
	},
});

export const { setRoutes, setGetListTouristRouteError } =
	touristRouteSlice.actions;

export const selectRoutes = (state: RootState) => state.touristRoute.routes;
export const selectGetListTouristRoutesError = (state: RootState) => ({
	error: state.touristRoute.getListTouristRouteError,
	isError: !!state.touristRoute.getListTouristRouteError,
});
export const selectDeleteStatus = (state: RootState) =>
	state.touristRoute.deleteStatus;

export default touristRouteSlice.reducer;
