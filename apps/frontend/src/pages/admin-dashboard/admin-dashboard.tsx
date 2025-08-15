import { type JSX } from "react";

import {
	DashboardHeading,
	DashboardLayout,
	DashboardTable,
} from "./components/components.js";

const AdminDashboard = (): JSX.Element => {
	return (
		<DashboardLayout>
			<DashboardHeading
				subtitle="Manage points of interest and routes."
				title="Dashboard"
			/>
			<DashboardTable />
		</DashboardLayout>
	);
};

export { AdminDashboard };
