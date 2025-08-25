const PointOfInterestExceptionMessage = {
	CANNOT_DELETE_INCLUDED_IN_ROUTE:
		"Cannot delete POI because it's included in route :routeName.",
	ID_NOT_FOUND: "A point of interest with the specified ID was not found.",
	NAME_ALREADY_EXISTS: "A point of interest with this name already exists.",
	UPDATE_FAILED: "Point of interest update failed due to an unexpected error.",
} as const;

export { PointOfInterestExceptionMessage };
