import { ReviewValidationRule } from "./review-validation-rule.enum.js";

const ReviewValidationMessage = {
	CONTENT_TOO_LONG: `Content must be less than ${String(ReviewValidationRule.CONTENT_MAX_LENGTH)} characters.`,
	CONTENT_TOO_SHORT: `Content must be at least ${String(ReviewValidationRule.CONTENT_MIN_LENGTH)} character(s).`,
	ONLY_ONE_ALLOWED: "Only one of routeId or poiId can be provided.",
	POI_ID_MUST_BE_INTEGER: "poiId must be an integer.",
	POI_ID_MUST_BE_NUMBER: "POI ID must be a number",
	POI_ID_TOO_SMALL: `poiId must be greater than ${String(ReviewValidationRule.ID_MIN_VALUE)}.`,
	ROUTE_ID_MUST_BE_INTEGER: "routeId must be an integer.",
	ROUTE_ID_MUST_BE_NUMBER: "Route ID must be a number",
	ROUTE_ID_TOO_SMALL: `routeId must be greater than ${String(ReviewValidationRule.ID_MIN_VALUE)}.`,
	ROUTE_OR_POI_REQUIRED: "Either route_id or poi_id must be provided.",
} as const;

export { ReviewValidationMessage };
