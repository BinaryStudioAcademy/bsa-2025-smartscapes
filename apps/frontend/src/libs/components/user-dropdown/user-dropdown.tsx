import { type JSX } from "react";

import { Button } from "../components.js";
import styles from "./styles.module.css";

type Properties = {
	onLogout: () => void;
};

const UserDropdown = ({ onLogout }: Properties): JSX.Element => {
	return (
		<div className={styles["user-dropdown"]}>
			<Button label="Log out" onClick={onLogout} />
		</div>
	);
};

export { UserDropdown };
