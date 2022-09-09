import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
import { selectAllUsers, useGetUsersQuery } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";

const NewNote = () => {
	useTitle("Dan D. Repairs | New Note");
	const { users } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			users: data?.ids?.map((id) => data?.entities[id]),
		}),
	});

	if (!users?.length) return <PulseLoader color={"#fff"} />;

	const content = <NewNoteForm users={users} />;

	return content;
};
export default NewNote;
