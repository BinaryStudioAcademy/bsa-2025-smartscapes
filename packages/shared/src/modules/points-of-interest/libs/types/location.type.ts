import { type PointsOfInterestLocationType } from "./location-type.type.js";

type PointsOfInterestLocation = {
	coordinates: [number, number];
	type: PointsOfInterestLocationType;
};

export { type PointsOfInterestLocation };
