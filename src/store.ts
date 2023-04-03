import { configureStore } from "@reduxjs/toolkit";
import staffReducer from "./features/staffSlice";

const store = configureStore({
	reducer: {
		staff: staffReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>

export default store;
