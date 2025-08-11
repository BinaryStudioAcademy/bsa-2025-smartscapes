import { type MapOptions } from "../types/types.js";
import { DEFAULT_COORDS } from "./default-coords.constant.js";

const MAP_OPTIONS: Omit<MapOptions, "container"> = {
	center: [DEFAULT_COORDS.LONGITUDE, DEFAULT_COORDS.LATITUDE],
	style: "mapbox://styles/mapbox/streets-v12",
	zoom: 12,
};

export { MAP_OPTIONS };
