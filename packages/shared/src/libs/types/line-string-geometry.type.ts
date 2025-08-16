import { type LocationType } from "../enums/enums.js";
import { type Coordinates } from "./coordinates.type.js";

type LineStringGeometry = {
	coordinates: Coordinates[];
	type: typeof LocationType.LINE_STRING;
};

export { type LineStringGeometry };
