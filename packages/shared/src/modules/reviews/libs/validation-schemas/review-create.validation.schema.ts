import { z, type ZodType } from "zod";

import {
	ReviewValidationMessage,
	ReviewValidationRule,
} from "../enums/enums.js";
import { type ReviewRequestDto } from "../types/types.js";

const reviewCreate: ZodType<ReviewRequestDto> = z
	.strictObject({
		content: z
			.string()
			.min(ReviewValidationRule.CONTENT_MIN_LENGTH, {
				message: ReviewValidationMessage.CONTENT_TOO_SHORT,
			})
			.max(ReviewValidationRule.CONTENT_MAX_LENGTH, {
				message: ReviewValidationMessage.CONTENT_TOO_LONG,
			}),
		poiId: z.number().int().positive().nullable(),
		routeId: z.number().int().positive().nullable(),
		userId: z.number().int().positive(),
	})
	.refine((data) => data.routeId !== null || data.poiId !== null, {
		message: ReviewValidationMessage.ROUTE_OR_POI_REQUIRED,
		path: ["routeId"],
	});

export { reviewCreate };
