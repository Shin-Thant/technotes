import React from "react";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import Note from "./Note";
import { useGetNotesQuery } from "./notesApiSlice";

export const NoteList = () => {
	useTitle("Dan D. Repairs | Notes List");
	const { username, isManager, isAdmin } = useAuth();

	const {
		data: notes,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetNotesQuery("notesList", {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	let content;

	if (isLoading) content = <PulseLoader color={"#fff"} />;

	if (isError) {
		content = <p className="errmsg">{error?.data?.message}</p>;
	}

	if (isSuccess) {
		const { ids, entities } = notes;

		let filteredIds;
		if (isManager || isAdmin) {
			filteredIds = [...ids];
		} else {
			filteredIds = ids?.filter(
				(id) => entities[id].username === username
			);
		}

		const tableContent =
			ids?.length &&
			filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

		content = (
			<table className="table table--notes">
				<thead className="table__thead">
					<tr>
						<th scope="col" className="table__th note__status">
							Username
						</th>
						<th scope="col" className="table__th note__created">
							Created
						</th>
						<th scope="col" className="table__th note__updated">
							Updated
						</th>
						<th scope="col" className="table__th note__title">
							Title
						</th>
						<th scope="col" className="table__th note__username">
							Owner
						</th>
						<th scope="col" className="table__th note__edit">
							Edit
						</th>
					</tr>
				</thead>
				<tbody>{tableContent}</tbody>
			</table>
		);
	}

	return content;
};
