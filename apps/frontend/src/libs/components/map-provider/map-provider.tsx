import React, { createContext, useMemo } from "react";

import { combineClassNames } from "~/libs/helpers/combine-class-names.helper.js";
import { useContext, useEffect, useRef } from "~/libs/hooks/hooks.js";
import {
	MapClient,
	type MapOptions,
	type MarkerOptions,
} from "~/libs/modules/map-client/map-client.js";

import styles from "./styles.module.css";

const MapContext = createContext<MapClient | null>(null);

type MapProviderProperties = {
	center?: [number, number];
	children?: React.ReactNode;
	className?: string;
	markers?: Array<MarkerOptions & { id: string }>;
	onMarkerClick?: (id: string, coordinates: [number, number]) => void;
};

const MapProvider = ({
	center,
	children,
	className,
	markers = [],
	onMarkerClick,
}: MapProviderProperties): React.JSX.Element => {
	const mapClientInstance = useMemo(() => new MapClient(), []);
	const containerReference = useRef<HTMLDivElement>(null);
	const initializedReference = useRef<boolean>(false);

	useEffect(() => {
		const client = mapClientInstance;
		const container = containerReference.current;

		if (!container || initializedReference.current) {
			return;
		}

		const mapOptions: MapOptions = {};

		if (center !== undefined) {
			mapOptions.center = center;
		}

		client.init(container, mapOptions);
		client.addAllMapControls();
		initializedReference.current = true;

		return (): void => {
			client.destroy();
			initializedReference.current = false;
		};
	}, [mapClientInstance, center]);

	useEffect(() => {
		const client = mapClientInstance;

		if (!initializedReference.current || !client.getMap() || !center) {
			return;
		}

		client.flyTo(center);
	}, [center, mapClientInstance]);

	useEffect(() => {
		const client = mapClientInstance;

		if (!client.getMap()) {
			return;
		}

		client.clearAllMarkers();
		client.addMarkers(markers);

		if (onMarkerClick) {
			client.setMarkerClickHandler(onMarkerClick);
		}
	}, [markers, onMarkerClick, mapClientInstance]);

	return (
		<MapContext.Provider value={mapClientInstance}>
			<div className={combineClassNames(styles["map-wrapper"], className)}>
				<div className={styles["map"]} ref={containerReference} />
				<div className={styles["map-overlays"]}>{children}</div>
			</div>
		</MapContext.Provider>
	);
};

const useMapContext = (): MapClient | null => useContext(MapContext);

export { MapProvider, useMapContext };
