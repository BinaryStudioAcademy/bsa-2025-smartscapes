import { z } from "zod";

import {
	PointsOfInterestValidationMessage,
	PointsOfInterestValidationRule,
} from "../enums/enums.js";

const locationSchema = z.object({
	coordinates: z.tuple([
		z
			.number()
			.min(
				PointsOfInterestValidationRule.LONGITUDE_MIN,
				PointsOfInterestValidationMessage.LONGITUDE_MIN,
			)
			.max(
				PointsOfInterestValidationRule.LONGITUDE_MAX,
				PointsOfInterestValidationMessage.LONGITUDE_MAX,
			),
		z
			.number()
			.min(
				PointsOfInterestValidationRule.LATITUDE_MIN,
				PointsOfInterestValidationMessage.LATITUDE_MIN,
			)
			.max(
				PointsOfInterestValidationRule.LATITUDE_MAX,
				PointsOfInterestValidationMessage.LATITUDE_MAX,
			),
	]),
	type: z.literal("Point", {
		message: PointsOfInterestValidationMessage.INVALID_LOCATION_TYPE,
	}),
});

export { locationSchema };
