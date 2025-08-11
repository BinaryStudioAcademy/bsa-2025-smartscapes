import React from "react";

import { MapProvider } from "~/libs/components/components.js";
import { useMapClient } from "~/libs/hooks/hooks.js";

import { mockPOIs } from "./mock-pois.js";
import styles from "./styles.module.css";

// TODO: Dummy component to use useMapClient and silence unused export warning, delete it as soon as possible
const DummyMapClientUser = (): null => {
	const mapClient = useMapClient();

	mapClient.resize();

	return null;
};

const Explore = (): React.JSX.Element => {
	return (
		<main className={styles["main"]}>
			<MapProvider markers={mockPOIs}>
				<DummyMapClientUser />
			</MapProvider>
		</main>
	);
};

export { Explore };
