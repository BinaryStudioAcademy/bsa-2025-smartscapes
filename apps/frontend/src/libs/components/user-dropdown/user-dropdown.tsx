import { type JSX } from "react";

import { type DropdownMenuItem } from "~/libs/types/types.js";

import { Button, Link } from "../components.js";
import styles from "./styles.module.css";

type Properties = {
	dropdownMenuItems: DropdownMenuItem[];
	onLogout: () => void;
};

const UserDropdown = ({
	dropdownMenuItems,
	onLogout,
}: Properties): JSX.Element => {
	return (
		<div className={styles["user-dropdown"]}>
			<ul className={styles["dropdown-list"]}>
				{dropdownMenuItems.map((item, index) => (
					<li className={styles["list-item"]} key={index}>
						<Link to={item.href}>{item.label}</Link>
					</li>
				))}
			</ul>
			<Button label="Log out" onClick={onLogout} />
		</div>
	);
};

export { UserDropdown };
