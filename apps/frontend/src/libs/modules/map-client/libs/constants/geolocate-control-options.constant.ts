import { type GeolocateControlOptions } from "../types/types.js";

const GEOLOCATE_CONTROL_OPTIONS: GeolocateControlOptions = {
	positionOptions: {
		enableHighAccuracy: true,
		maximumAge: 60_000,
		timeout: 15_000,
	},
	showAccuracyCircle: true,
	showUserHeading: true,
	trackUserLocation: true,
};

export { GEOLOCATE_CONTROL_OPTIONS };
