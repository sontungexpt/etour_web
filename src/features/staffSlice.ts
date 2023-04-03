import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
	_id: "",
	fullName: "",
	role: "",
	permissions: [],
	companyId: "",
};

export interface IStaffInformation {
	_id: string;
	fullName: string;
	role: string;
	permissions: string[];
	companyId: string;
}

export const staffSlice = createSlice({
	name: "staff",
	initialState,
	reducers: {
		setBasicInformation(state, action) {
			state._id = action.payload._id;
			state.companyId = action.payload.companyId;
			state.fullName = action.payload.fullName;
			state.permissions = action.payload.permissions;
			state.role = action.payload.role;
		},
	},
});

export const { setBasicInformation } = staffSlice.actions;

export const selectBasicInformation = (state: RootState): IStaffInformation =>
	state.staff;

export default staffSlice.reducer;
