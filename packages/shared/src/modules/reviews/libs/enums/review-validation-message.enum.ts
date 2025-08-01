import { ReviewValidationRule } from "./review-validation-rule.enum.js";

const ReviewValidationMessage = {
	CONTENT_TOO_LONG: `Content must be less than ${String(ReviewValidationRule.CONTENT_MAX_LENGTH)} characters.`,
	CONTENT_TOO_SHORT: `Content must be at least ${String(ReviewValidationRule.CONTENT_MIN_LENGTH)} character(s).`,
	ONLY_ONE_ALLOWED: "Only one of routeId or poiId can be provided.",
	ROUTE_OR_POI_REQUIRED: "Either route_id or poi_id must be provided.",
} as const;

export { ReviewValidationMessage };
