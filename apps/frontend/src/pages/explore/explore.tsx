import React from "react";

import { MapProvider } from "~/libs/components/components.js";

import { ExploreRoutes } from "./components/components.js";
import styles from "./styles.module.css";

const Explore = (): React.JSX.Element => {
	return (
		<main className={styles["main"]}>
			<MapProvider>
				<ExploreRoutes />
			</MapProvider>
		</main>
	);
};

export { Explore };
