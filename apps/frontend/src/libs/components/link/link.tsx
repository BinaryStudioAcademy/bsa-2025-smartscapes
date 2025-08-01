import { NavLink } from "react-router";

import { type AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	to: ValueOf<typeof AppRoute>;
};

const Link = ({ children, to }: Properties): React.JSX.Element => (
	<NavLink className={styles["link"] as string} to={to}>
		{children}
	</NavLink>
);

export { Link };
