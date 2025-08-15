import { type JSX } from "react";

import styles from "./styles.module.css";

type Properties = {
	subtitle: string;
	title: string;
};

const DashboardHeading = ({ subtitle, title }: Properties): JSX.Element => {
	return (
		<div className={styles["heading"]}>
			<h1 className={styles["title"]}>{title}</h1>
			<p className={styles["subtitle"]}>{subtitle}</p>
		</div>
	);
};

export { DashboardHeading };
