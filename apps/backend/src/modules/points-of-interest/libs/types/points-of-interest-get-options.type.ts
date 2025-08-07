import { type PointsOfInterestSearchQuery } from "./type.js";

type PointsOfInterestFindAllOptions = PointsOfInterestSearchQuery & {
	ids?: number[];
};

export { type PointsOfInterestFindAllOptions };
