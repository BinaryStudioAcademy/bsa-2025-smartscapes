import { ReviewValidationRule } from "./review-validation-rule.enum.js";

const ReviewValidationMessage = {
	CONTENT_TOO_LONG: `Content must be less than ${String(ReviewValidationRule.CONTENT_MAX_LENGTH)} characters.`,
	CONTENT_TOO_SHORT: `Content must be at least ${String(ReviewValidationRule.CONTENT_MIN_LENGTH)} character(s).`,
	ONLY_ONE_ALLOWED:
		"Only one of Route ID or Point of interest ID can be provided.",
	POI_ID_MUST_BE_INTEGER: "Point of interest ID must be an integer.",
	POI_ID_MUST_BE_NUMBER: "Point of interest ID must be a number.",
	POI_ID_TOO_SMALL: `Point of interest ID must be greater than ${String(ReviewValidationRule.ID_MIN_VALUE)}.`,
	ROUTE_ID_MUST_BE_INTEGER: "Route ID must be an integer.",
	ROUTE_ID_MUST_BE_NUMBER: "Route ID must be a number.",
	ROUTE_ID_TOO_SMALL: `Route ID must be greater than ${String(ReviewValidationRule.ID_MIN_VALUE)}.`,
	ROUTE_OR_POI_REQUIRED:
		"Either Route ID or Point of interest ID must be provided.",
} as const;

export { ReviewValidationMessage };
