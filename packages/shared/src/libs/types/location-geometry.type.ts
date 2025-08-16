import { type LocationType } from "../enums/enums.js";
import { type Coordinates } from "./coordinates.type.js";

type PointGeometry = {
	coordinates: Coordinates;
	type: typeof LocationType.POINT;
};

export { type PointGeometry };
