import { PointsOfInterestValidationRule } from "./points-of-interest-validation-rule.js";

const PointsOfInterestValidationMessage = {
	COORDS_REQUIRED_TOGETHER:
		"Both latitude and longitude must be provided together.",
	COORDS_REQUIRED_WITH_RADIUS:
		"Location coordinates are required when radius is provided.",
	INVALID_LOCATION_TYPE: "Location type must be 'Point'.",
	LATITUDE_MAX: `Latitude must be less than ${String(PointsOfInterestValidationRule.LATITUDE_MAX)}.`,
	LATITUDE_MIN: `Latitude must be greater than ${String(PointsOfInterestValidationRule.LATITUDE_MIN)}.`,
	LONGITUDE_MAX: `Longitude must be less than ${String(PointsOfInterestValidationRule.LONGITUDE_MAX)}.`,
	LONGITUDE_MIN: `Longitude must be greater than ${String(PointsOfInterestValidationRule.LONGITUDE_MIN)}.`,
	NAME_MAXIMUM_LENGTH: `Name must be less than ${String(PointsOfInterestValidationRule.NAME_MAX_LENGTH)} characters long.`,
	NAME_MINIMUM_LENGTH: `Name must be at least ${String(PointsOfInterestValidationRule.NAME_MIN_LENGTH)} characters long.`,
	RADIUS_MAX_KM: `Radius must be less than ${String(PointsOfInterestValidationRule.RADIUS_MAX_KM)} kilometers.`,
	RADIUS_MIN_KM: `Radius must be greater than ${String(PointsOfInterestValidationRule.RADIUS_MIN_KM)} kilometers.`,
	REQUIRED_FIELDS_FOR_UPDATE: "At least one field must be provided for update.",
} as const;

export { PointsOfInterestValidationMessage };
