import { PointsOfInterestValidationRule } from "./points-of-interest-validation-rule.js";

const PointsOfInterestValidationMessage = {
	NAME_MAXIMUM_LENGTH: `Name must be less than ${String(PointsOfInterestValidationRule.NAME_MAXIMUM_LENGTH)} characters long.`,
	NAME_MINIMUM_LENGTH: `Name must be at least ${String(PointsOfInterestValidationRule.NAME_MINIMUM_LENGTH)} characters long.`,
	REQUIRED_FIELDS_FOR_UPDATE: "At least one field must be provided for update.",
} as const;

export { PointsOfInterestValidationMessage };
