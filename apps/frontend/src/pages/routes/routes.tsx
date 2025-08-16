import { Button } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

const Routes = (): React.JSX.Element => {
	return (
		<main className={styles["main"]}>
			Routes Page
			<Button label="Back to app" to={AppRoute.APP} />
		</main>
	);
};

export { Routes };
