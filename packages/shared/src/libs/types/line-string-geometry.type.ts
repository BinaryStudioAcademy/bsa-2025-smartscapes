import { type PointGeometry } from "./location-geometry.type.js";

type LineStringGeometry = {
	coordinates: PointGeometry["coordinates"][];
	type: "LineString";
};

export { type LineStringGeometry };
