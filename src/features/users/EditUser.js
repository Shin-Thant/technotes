import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserById, useGetUsersQuery } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const EditUser = () => {
	useTitle("Dan D. Repairs | Edit User");
	const { id } = useParams();

	const { user } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[id],
		}),
	});

	if (!user) return <PulseLoader color={"#FFF"} />;

	const content = <EditUserForm user={user} />;

	return content;
};

export default EditUser;
