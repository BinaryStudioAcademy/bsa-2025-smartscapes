import { z } from "zod";

import {
	PointsOfInterestValidationMessage,
	PointsOfInterestValidationRule,
} from "../enums/enums.js";
import { locationSchema } from "./location.validation-schema.js";

const MINIMUM_FIELDS_TO_UPDATE = 1;

const pointOfInterestUpdate = z
	.strictObject({
		location: locationSchema.optional(),
		name: z
			.string()
			.min(PointsOfInterestValidationRule.NAME_MIN_LENGTH, {
				message: PointsOfInterestValidationMessage.NAME_MINIMUM_LENGTH,
			})
			.max(PointsOfInterestValidationRule.NAME_MAX_LENGTH, {
				message: PointsOfInterestValidationMessage.NAME_MAXIMUM_LENGTH,
			})
			.optional(),
	})
	.refine(
		(data) => {
			return Object.keys(data).length >= MINIMUM_FIELDS_TO_UPDATE;
		},
		{
			message: PointsOfInterestValidationMessage.REQUIRED_FIELDS_FOR_UPDATE,
		},
	);

export { pointOfInterestUpdate };
