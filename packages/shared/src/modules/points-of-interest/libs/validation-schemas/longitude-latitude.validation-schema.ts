import { z } from "zod";

import { parseToFloat } from "../../../../libs/helpers/helpers.js";
import {
	PointsOfInterestValidationMessage,
	PointsOfInterestValidationRule,
} from "../enums/enums.js";

const longitudeSchema = z
	.string()
	.transform(parseToFloat)
	.pipe(
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
	)
	.optional();

const latitudeSchema = z
	.string()
	.transform(parseToFloat)
	.pipe(
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
	);

export { latitudeSchema, longitudeSchema };
