import { type PointGeometry } from "@smartscapes/shared";
import { LocationType } from "@smartscapes/shared/src/libs/enums/location-type.enum.js";
import React from "react";
import { type Control } from "react-hook-form";

import { Icon, MapContext, MapProvider } from "~/libs/components/components.js";
import { combineClassNames } from "~/libs/helpers/combine-class-names.helper.js";
import {
	useContext,
	useEffect,
	useFormController,
} from "~/libs/hooks/hooks.js";
import { type PointsOfInterestRequestDto } from "~/modules/points-of-interest/points-of-interest.js";

import styles from "./styles.module.css";

type Properties = {
	control: Control<PointsOfInterestRequestDto>;
	errorMessage?: string;
	label?: string;
	name: "location";
};

const MapLocationLogic = ({
	control,
	name,
}: {
	control: Control<PointsOfInterestRequestDto>;
	name: "location";
}): null => {
	const { field } = useFormController<PointsOfInterestRequestDto>({
		control,
		name,
	});
	const mapClient = useContext(MapContext);

	useEffect(() => {
		if (!mapClient) {
			return;
		}

		const pointGeometry = field.value as PointGeometry | undefined;
		const coordinates = pointGeometry?.coordinates;

		if (!coordinates) {
			mapClient.clearSelected();

			return;
		}

		mapClient.setSelected(coordinates);
	}, [mapClient, field.value]);

	useEffect((): (() => void) | undefined => {
		if (!mapClient) {
			return;
		}

		const cleanup = mapClient.enableClickToSelect((coordinates) => {
			field.onChange({
				coordinates,
				type: LocationType.POINT,
			} as PointGeometry);
		});

		return cleanup;
	}, [mapClient, field]);

	return null;
};

const MapLocationField = ({
	control,
	errorMessage,
	label = "Location",
	name,
}: Properties): React.JSX.Element => {
	return (
		<div className={styles["map-field"]}>
			<span className={styles["label-caption"]}>{label}</span>
			<div
				className={combineClassNames(
					styles["map-section"],
					errorMessage && styles["map-section-error"],
				)}
			>
				<MapProvider>
					<MapLocationLogic control={control} name={name} />
				</MapProvider>
			</div>
			{errorMessage && (
				<span className={styles["error"]}>
					<Icon height={24} name="error" width={24} />
					{errorMessage}
				</span>
			)}
		</div>
	);
};

export { MapLocationField };
