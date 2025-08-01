import { z } from "zod";

import {
	ReviewValidationMessage,
	ReviewValidationRule,
} from "../enums/enums.js";

const reviewCreate = z
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
	})
	.refine((data) => data.routeId !== null || data.poiId !== null, {
		message: ReviewValidationMessage.ROUTE_OR_POI_REQUIRED,
		path: ["routeId"],
	})
	.refine((data) => !(data.routeId !== null && data.poiId !== null), {
		message: ReviewValidationMessage.ONLY_ONE_ALLOWED,
		path: ["routeId"],
	});

export { reviewCreate };
