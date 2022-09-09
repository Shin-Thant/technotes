import React from "react";
import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

export const UsersList = () => {
	useTitle("Dan D. Repairs | Users List");
	const {
		data: users,
		isLoading,
		isError,
		isSuccess,
		error,
	} = useGetUsersQuery("usersList", {
		pollingInterval: 600000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	let content;

	if (isLoading) {
		content = <PulseLoader color={"#fff"} />;
	}

	if (isError) {
		content = <p className="errmsg">{error?.data?.message}</p>;
	}

	if (isSuccess) {
		const { ids } = users;

		const tableContent =
			ids?.length &&
			ids.map((userId) => <User key={userId} userId={userId} />);

		content = (
			<table className="table table--users">
				<thead className="table__thead">
					<tr>
						<th scope="col" className="table__th user__username">
							Username
						</th>
						<th scope="col" className="table__th user__roles">
							Roles
						</th>
						<th scope="col" className="table__th user__edit">
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
