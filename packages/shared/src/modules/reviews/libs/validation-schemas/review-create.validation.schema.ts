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
		poiId: z
			.number({ message: ReviewValidationMessage.POI_ID_MUST_BE_NUMBER })
			.int({ message: ReviewValidationMessage.POI_ID_MUST_BE_INTEGER })
			.positive({ message: ReviewValidationMessage.POI_ID_TOO_SMALL })
			.nullable(),

		routeId: z
			.number({ message: ReviewValidationMessage.ROUTE_ID_MUST_BE_NUMBER })
			.int({ message: ReviewValidationMessage.ROUTE_ID_MUST_BE_INTEGER })
			.positive({ message: ReviewValidationMessage.ROUTE_ID_TOO_SMALL })
			.nullable(),
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
