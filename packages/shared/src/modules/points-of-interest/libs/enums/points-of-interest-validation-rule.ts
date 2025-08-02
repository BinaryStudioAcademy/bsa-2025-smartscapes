const PointsOfInterestValidationRule = {
	LATITUDE_MAX: 90,
	LATITUDE_MIN: -90,
	LONGITUDE_MAX: 180,
	LONGITUDE_MIN: -180,
	NAME_MAX_LENGTH: 255,
	NAME_MIN_LENGTH: 3,
} as const;

export { PointsOfInterestValidationRule };
