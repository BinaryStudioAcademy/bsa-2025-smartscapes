import { z, type ZodType } from "zod";

import {
	PointsOfInterestValidationMessage,
	PointsOfInterestValidationRule,
} from "../enums/enums.js";
import { type PointsOfInterestRequestDto } from "../types/types.js";

const pointOfInterestCreate: ZodType<PointsOfInterestRequestDto> =
	z.strictObject({
		name: z
			.string()
			.min(PointsOfInterestValidationRule.NAME_MINIMUM_LENGTH, {
				message: PointsOfInterestValidationMessage.NAME_MINIMUM_LENGTH,
			})
			.max(PointsOfInterestValidationRule.NAME_MAXIMUM_LENGTH, {
				message: PointsOfInterestValidationMessage.NAME_MAXIMUM_LENGTH,
			}),
	});

export { pointOfInterestCreate };
