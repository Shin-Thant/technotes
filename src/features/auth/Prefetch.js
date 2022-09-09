import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

// this is the prefetcing logic which cover the whole 'dash' route
// if use reach this component, we'll prefetch the notes and users
// if the component unmount then we unsubscribe to remove the cached data

const Prefetch = () => {
	useEffect(() => {
		store.dispatch(notesApiSlice.util.prefetch("getNotes", "notesList", {force: true}));
		store.dispatch(usersApiSlice.util.prefetch("getUsers", "usersList", {force: true,}));
	}, []);

	return <Outlet />;
};
export default Prefetch;
