import { Button } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

const NotFound = (): React.JSX.Element => {
	return (
		<main className={styles["container"]}>
			<div className={styles["error-container"]}>
				<div className={styles["error-message"]}>
					<h1 className={styles["error-number-label"]}>404</h1>
					<h2 className={styles["error-message-title"]}>
						Something went wrong
					</h2>

					<span className={styles["error-description"]}>
						Sorry, we can’t find the page you’re looking for.
					</span>
				</div>

				<div>
					<Button label="Back to home" to={AppRoute.ROOT} />
				</div>
			</div>
		</main>
	);
};

export { NotFound };
