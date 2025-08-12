import { type PointGeometry } from "../../../../libs/types/types.js";

type PointsOfInterestRequestDto = {
	location: PointGeometry;
	name: string;
};

export { type PointsOfInterestRequestDto };
