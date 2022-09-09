import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
	sortComparer: (a, b) =>
		a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotes: builder.query({
			query: () => ({
				url: "/notes",
				validateStatus: (response) => {
					return response.status === 200 && !response.isError;
				},
			}),

			transformResponse: (responseData) => {
				const loadedNotes = responseData?.map((note) => {
					note.id = note._id;
					return note;
				});

				return notesAdapter.setAll(initialState, loadedNotes);
			},
			providesTags: (result, error, res) => {
				if (res?.ids) {
					return [
						...res.ids?.map((id) => ({ type: "Note", id: id })),
						{ type: "Note", id: "LIST" },
					];
				} else {
					return [{ type: "Note", id: "LIST" }];
				}
			},
		}),
		addNewNote: builder.mutation({
			query: (initialNote) => ({
				url: "/notes",
				method: "POST",
				body: {
					...initialNote,
				},
			}),
			invalidatesTags: [{ type: "Note", id: "LIST" }],
		}),
		updateNote: builder.mutation({
			query: (initialNote) => ({
				url: "/notes",
				method: "PATCH",
				body: {
					...initialNote,
				},
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Note", id: arg.id },
			],
		}),
		deleteNote: builder.mutation({
			query: ({ id }) => ({
				url: `/notes`,
				method: "DELETE",
				body: { id },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Note", id: arg.id },
			],
		}),
	}),
});

export const {
	useGetNotesQuery,
	useAddNewNoteMutation,
	useUpdateNoteMutation,
	useDeleteNoteMutation,
} = notesApiSlice;

// get the query result object
const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memorized selectors to get the "normalized object with ids and entities"
const selectNotesData = createSelector(
	selectNotesResult,
	(notesResult) => notesResult.data
);

// get the selectors to get the normalized state data
export const {
	selectAll: selectAllNotes,
	selectIds: selectNoteIds,
	selectById: selectNoteById,
} = notesAdapter.getSelectors(
	(state) => selectNotesData(state) ?? initialState
);
