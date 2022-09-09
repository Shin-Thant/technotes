import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import authSlice from "../features/auth/authSlice";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		auth: authSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
	devTools: false,
});
// * disabled the redux devtools with 'devTools: false'

// this is the entriprise software. so the data must be refetched not only on reload but also on focus, on every specific time
// with setupListeners(store.dispatch), this enables the things above i describe
setupListeners(store.dispatch);
