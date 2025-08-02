import { PointsOfInterestValidationRule } from "./points-of-interest-validation-rule.js";

const PointsOfInterestValidationMessage = {
	INVALID_LOCATION_TYPE: "Location type must be 'Point'.",
	LATITUDE_MAX: `Latitude must be less than ${String(PointsOfInterestValidationRule.LATITUDE_MAX)}.`,
	LATITUDE_MIN: `Latitude must be greater than ${String(PointsOfInterestValidationRule.LATITUDE_MIN)}.`,
	LONGITUDE_MAX: `Longitude must be less than ${String(PointsOfInterestValidationRule.LONGITUDE_MAX)}.`,
	LONGITUDE_MIN: `Longitude must be greater than ${String(PointsOfInterestValidationRule.LONGITUDE_MIN)}.`,
	NAME_MAXIMUM_LENGTH: `Name must be less than ${String(PointsOfInterestValidationRule.NAME_MAX_LENGTH)} characters long.`,
	NAME_MINIMUM_LENGTH: `Name must be at least ${String(PointsOfInterestValidationRule.NAME_MIN_LENGTH)} characters long.`,
	REQUIRED_FIELDS_FOR_UPDATE: "At least one field must be provided for update.",
} as const;

export { PointsOfInterestValidationMessage };
