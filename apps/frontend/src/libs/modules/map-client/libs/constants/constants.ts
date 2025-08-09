import {
	type ControlPosition,
	type GeolocateControlOptions,
	type MapOptions,
	type MarkerOptions,
	type NavigationControlOptions,
	type ScaleControlOptions,
} from "../types/types.js";

const CONTROL_IDS = {
	GEOLOCATE: "geolocate",
	NAVIGATION: "navigation",
	SCALE: "scale",
} as const;

const GEOLOCATE_TRIGGER_DELAY = 100;

const KYIV_LONGITUDE = 30.5234;
const KYIV_LATITUDE = 50.4501;
const DEFAULT_MAP_OPTIONS: Omit<MapOptions, "container"> = {
	center: [KYIV_LONGITUDE, KYIV_LATITUDE],
	style: "mapbox://styles/mapbox/streets-v12",
	zoom: 12,
};

const DEFAULT_MARKER_OPTIONS: MarkerOptions = {
	color: "hsl(162deg 91% 25% / 100%)",
	coordinates: [KYIV_LONGITUDE, KYIV_LATITUDE],
	scale: 1,
};

const DEFAULT_NAVIGATION_CONTROL_OPTIONS: NavigationControlOptions & {
	position?: ControlPosition;
} = {
	position: "top-right",
	showCompass: true,
	showZoom: true,
	visualizePitch: true,
};

const DEFAULT_SCALE_CONTROL_OPTIONS: ScaleControlOptions & {
	position?: ControlPosition;
} = {
	maxWidth: 80,
	position: "bottom-left",
	unit: "metric",
};

const DEFAULT_GEOLOCATE_CONTROL_OPTIONS: GeolocateControlOptions & {
	autoTrigger?: boolean;
	position?: ControlPosition;
} = {
	autoTrigger: false,
	position: "bottom-right",
	positionOptions: {
		enableHighAccuracy: true,
		maximumAge: 60_000,
		timeout: 15_000,
	},
	showAccuracyCircle: true,
	showUserHeading: true,
	trackUserLocation: true,
};

export {
	CONTROL_IDS,
	DEFAULT_GEOLOCATE_CONTROL_OPTIONS,
	DEFAULT_MAP_OPTIONS,
	DEFAULT_MARKER_OPTIONS,
	DEFAULT_NAVIGATION_CONTROL_OPTIONS,
	DEFAULT_SCALE_CONTROL_OPTIONS,
	GEOLOCATE_TRIGGER_DELAY,
};
