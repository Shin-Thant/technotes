import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: "https://technotes-api.onrender.com",
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token;

		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

// this is a wrapper function for fetchBaseQuery()
const baseQueryWithReauth = async (args, api, extraOptions) => {
	// console.log({ args, api, extraOptions });
	// args is what the query function (query => () '...') returns

	// making requests with fetchBaseQuery
	let result = await baseQuery(args, api, extraOptions);

	// if the status code is 403, we will refresh the access token
	if (result?.error?.status === 403) {
		console.log("sending refresh token");

		// refresh access token with refresh token
		let refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

		if (refreshResult?.data) {
			// if result has data set new access token
			api?.dispatch(setCredentials({ ...refreshResult?.data }));

			// retry the original request with new access token
			result = await baseQuery({ args, api, extraOptions });
		} else {
			// if you don't have data which means your refresh token is expires or some error occur
			if (result?.error?.status === 403) {
				refreshResult.error.data.message = "Your login has expired.";
			}
			return refreshResult;
		}
	}

	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Note", "User"],
	endpoints: (builder) => ({}),
});
