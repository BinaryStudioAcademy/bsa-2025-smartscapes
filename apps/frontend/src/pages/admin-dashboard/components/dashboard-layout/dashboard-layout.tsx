import { type JSX, type PropsWithChildren } from "react";

import { Sidebar } from "~/libs/components/components.js";
import { NAVIGATION_ITEMS_GROUPS } from "~/libs/constants/constants.js";

import styles from "./styles.module.css";

const DashboardLayout = ({ children }: PropsWithChildren): JSX.Element => {
	return (
		<div className={styles["container"]}>
			<Sidebar navigationItemsGroups={NAVIGATION_ITEMS_GROUPS} />
			<main className={styles["dashboard"]}>{children}</main>
		</div>
	);
};

export { DashboardLayout };
