import React, { useCallback, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

import { Button, Input, Select } from "~/libs/components/components.js";
import { type SelectOption } from "~/libs/components/select/libs/types/types.js";
import { useAppForm, useMapClient } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

const DEFAULT_ZOOM = 15;
const MARKER_INCREMENT = 1;
const FIRST_ELEMENT_INDEX = 0;

type CustomMarkerForm = {
	customLat: string;
	customLng: string;
};

const ExploreRoutes = (): React.JSX.Element => {
	const mapClient = useMapClient();
	const [markerCount, setMarkerCount] = useState<number>(0);

	const {
		control: customControl,
		errors: customErrors,
		handleValueSet: setCustomValue,
	} = useAppForm<CustomMarkerForm>({
		defaultValues: {
			customLat: "",
			customLng: "",
		},
	});

	const customLat = useWatch({
		control: customControl,
		name: "customLat",
	});

	const customLng = useWatch({
		control: customControl,
		name: "customLng",
	});

	const [customMarkerId, setCustomMarkerId] = useState<number>(0);
	const [allMarkers, setAllMarkers] = useState<
		{
			coordinates: [number, number];
			id: string;
			name: string;
		}[]
	>([]);

	const placeOptions: SelectOption<string>[] = allMarkers.map(
		({ id, name }) => ({
			label: name,
			value: id,
		}),
	);

	type FormValues = {
		selectedPlace: string[];
	};

	const { control } = useAppForm<FormValues>({
		defaultValues: {
			selectedPlace: [],
		},
	});

	const selectedPlace = useWatch({
		control,
		name: "selectedPlace",
	});

	const handleFlyToPlace = useCallback(
		(coordinates: [number, number]): void => {
			mapClient.flyTo(coordinates, DEFAULT_ZOOM);
		},
		[mapClient],
	);

	useEffect(() => {
		if (selectedPlace.length > 0) {
			const placeId = selectedPlace[FIRST_ELEMENT_INDEX];
			const place = allMarkers.find(({ id }: { id: string }) => id === placeId);

			if (place) {
				handleFlyToPlace(place.coordinates);
			}
		}
	}, [selectedPlace, allMarkers, handleFlyToPlace]);

	useEffect(() => {
		mapClient.setMarkerClickHandler((id, coordinates) => {
			alert(
				`Marker ${id}: [${String(coordinates[0])}, ${String(coordinates[FIRST_ELEMENT_INDEX])}]`,
			);
		});
	}, [mapClient]);

	const handleClearMarkers = useCallback((): void => {
		mapClient.clearAllMarkers();
		setAllMarkers([]);
		setMarkerCount(0);
	}, [mapClient]);

	const handleAddCustomMarker = useCallback((): void => {
		const lng = Number.parseFloat(customLng || "");
		const lat = Number.parseFloat(customLat || "");

		if (Number.isNaN(lng) || Number.isNaN(lat)) {
			alert("Please enter valid coordinates");

			return;
		}

		const id = `custom-marker-${String(customMarkerId)}`;
		const name = `Custom Marker ${String(customMarkerId)}`;
		mapClient.addMarker(id, {
			coordinates: [lng, lat],
		});

		setAllMarkers((previous) => [
			...previous,
			{ coordinates: [lng, lat], id, name },
		]);
		setCustomMarkerId((previous) => previous + MARKER_INCREMENT);
		setMarkerCount((previous) => previous + MARKER_INCREMENT);
		setCustomValue("customLng", "");
		setCustomValue("customLat", "");
		mapClient.flyTo([lng, lat], DEFAULT_ZOOM);
	}, [mapClient, customMarkerId, customLng, customLat, setCustomValue]);

	return (
		<div className={styles["map-explorer"]}>
			<div className={styles["map-controls"]}>
				<h3>Explore routes</h3>
				<div className={styles["controls-section"]}>
					<Select
						control={control}
						label="Popular Places"
						name="selectedPlace"
						options={placeOptions}
						placeholder="Choose a place to visit"
					/>
				</div>
				<Button
					label={`Clear Markers (${String(markerCount)})`}
					onClick={handleClearMarkers}
				/>
				<div
					className={styles["custom-marker-controls"]}
					style={{ marginTop: 16 }}
				>
					<Input
						control={customControl}
						errors={customErrors}
						label="Longitude"
						name="customLng"
						placeholder="Longitude"
						type="text"
					/>
					<Input
						control={customControl}
						errors={customErrors}
						label="Latitude"
						name="customLat"
						placeholder="Latitude"
						type="text"
					/>
					<Button label="Add Marker" onClick={handleAddCustomMarker} />
				</div>
			</div>
		</div>
	);
};

export { ExploreRoutes };
