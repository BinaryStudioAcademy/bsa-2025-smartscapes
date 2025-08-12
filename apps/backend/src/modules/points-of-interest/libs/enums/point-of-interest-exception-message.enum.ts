const PointOfInterestExceptionMessage = {
	ID_NOT_FOUND: "A point of interest with the specified ID was not found.",
	NAME_ALREADY_EXISTS: "A point of interest with this name already exists.",
	UPDATE_FAILED: "Point of interest update failed due to an unexpected error.",
} as const;

export { PointOfInterestExceptionMessage };
