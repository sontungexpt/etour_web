import { configureStore } from "@reduxjs/toolkit";
import staffReducer from "./features/staffSlice";
import touristRouteReducer from "./features/touristRouteSlice";
import appReducer from "./features/appSlice";

const store = configureStore({
	reducer: {
		app: appReducer,
		staff: staffReducer,
		touristRoute: touristRouteReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
