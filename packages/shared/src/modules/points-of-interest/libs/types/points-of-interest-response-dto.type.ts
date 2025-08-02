import { type PointsOfInterestLocation } from "./location.type.js";

type PointsOfInterestResponseDto = {
	id: number;
	location: PointsOfInterestLocation;
	name: string;
};

export { type PointsOfInterestResponseDto };
