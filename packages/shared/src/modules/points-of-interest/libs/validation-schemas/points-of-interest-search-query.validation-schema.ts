import { z } from "zod";

import { parseToFloat } from "../../../../libs/helpers/helpers.js";
import {
	PointsOfInterestValidationMessage,
	PointsOfInterestValidationRule,
} from "../enums/enums.js";
import {
	latitudeSchema,
	longitudeSchema,
} from "./longitude-latitude.validation-schema.js";

const pointsOfInterestSearchQuery = z
	.object({
		latitude: latitudeSchema.optional(),
		longitude: longitudeSchema.optional(),
		radius: z
			.string()
			.transform(parseToFloat)
			.pipe(
				z
					.number()
					.min(
						PointsOfInterestValidationRule.RADIUS_MIN_KM,
						PointsOfInterestValidationMessage.RADIUS_MIN_KM,
					)
					.max(
						PointsOfInterestValidationRule.RADIUS_MAX_KM,
						PointsOfInterestValidationMessage.RADIUS_MAX_KM,
					),
			)
			.optional(),
	})
	.refine(
		({ latitude, longitude, radius }) =>
			!radius || (Boolean(latitude) && Boolean(longitude)),
		{
			message: PointsOfInterestValidationMessage.COORDS_REQUIRED_WITH_RADIUS,
		},
	)
	.refine(
		({ latitude, longitude }) => Boolean(latitude) === Boolean(longitude),
		{
			message: PointsOfInterestValidationMessage.COORDS_REQUIRED_TOGETHER,
		},
	);

export { pointsOfInterestSearchQuery };
