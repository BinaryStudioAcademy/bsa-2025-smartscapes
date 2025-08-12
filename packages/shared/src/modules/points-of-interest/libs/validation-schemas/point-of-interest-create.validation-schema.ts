import { z } from "zod";

import {
	PointsOfInterestValidationMessage,
	PointsOfInterestValidationRule,
} from "../enums/enums.js";
import { locationSchema } from "./location.validation-schema.js";

const pointOfInterestCreate = z.strictObject({
	location: locationSchema,
	name: z
		.string()
		.min(PointsOfInterestValidationRule.NAME_MIN_LENGTH, {
			message: PointsOfInterestValidationMessage.NAME_MINIMUM_LENGTH,
		})
		.max(PointsOfInterestValidationRule.NAME_MAX_LENGTH, {
			message: PointsOfInterestValidationMessage.NAME_MAXIMUM_LENGTH,
		}),
});

export { pointOfInterestCreate };
