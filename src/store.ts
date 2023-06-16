import { configureStore } from "@reduxjs/toolkit";
import staffReducer from "./features/staffSlice";
import touristRouteReducer from "./features/touristRouteSlice";

const store = configureStore({
	reducer: {
		staff: staffReducer,
		touristRoute: touristRouteReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
