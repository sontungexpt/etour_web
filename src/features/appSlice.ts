import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
	socket: null,
};

export const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setSocket(state, action) {
			state.socket = action.payload;
		},
	},
});

export const { setSocket } = appSlice.actions;

export const selectSocket = (state: RootState) => state.app.socket;

export default appSlice.reducer;
