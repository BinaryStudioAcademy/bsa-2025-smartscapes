import { type LocationType } from "../enums/enums.js";

type PointGeometry = {
	coordinates: [number, number];
	type: typeof LocationType.POINT;
};

export { type PointGeometry };
