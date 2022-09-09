import React from "react";
import { Outlet } from "react-router-dom";
import { DashFooter } from "./DashFooter";
import { DashHeader } from "./DashHeader";

export const DashLayout = () => {
	return (
		<>
			<DashHeader />
			<div className="dash-container">
				<Outlet />
			</div>
			<DashFooter />
		</>
	);
};
