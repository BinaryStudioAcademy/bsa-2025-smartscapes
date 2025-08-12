import { type PointGeometry } from "@smartscapes/shared";
import React from "react";

import { createContext, useEffect, useRef } from "~/libs/hooks/hooks.js";
import { MapClient } from "~/libs/modules/map-client/map-client.js";

import styles from "./styles.module.css";

const MapContext = createContext<MapClient | null>(null);

type Properties = {
	children?: React.ReactNode;
	markers?: { coordinates: PointGeometry["coordinates"] }[];
};

const MapProvider = ({
	children,
	markers = [],
}: Properties): React.JSX.Element => {
	const mapClientReference = useRef(new MapClient());
	const containerReference = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const client = mapClientReference.current;
		const container = containerReference.current;

		if (!container) {
			return;
		}

		client.init(container);

		return (): void => {
			client.destroy();
		};
	}, []);

	useEffect(() => {
		const client = mapClientReference.current;
		client.addNavigationControl();
		client.addScaleControl();
		client.addGeolocateControl();
	}, []);

	useEffect(() => {
		const client = mapClientReference.current;

		client.addMarkers(markers);
	}, [markers]);

	return (
		<MapContext.Provider value={mapClientReference.current}>
			<div className={styles["map-wrapper"]}>
				<div className={styles["map"]} ref={containerReference} />
				<div className={styles["map-overlays"]}>{children}</div>
			</div>
		</MapContext.Provider>
	);
};

export { MapContext, MapProvider };
