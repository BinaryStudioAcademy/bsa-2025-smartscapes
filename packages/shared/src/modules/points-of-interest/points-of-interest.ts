export {
	type PointsOfInterestRequestDto,
	type PointsOfInterestResponseDto,
	type PointsOfInterestSearchQuery,
} from "./libs/types/types.js";
export {
	pointOfInterestCreate as pointOfInterestCreateValidationSchema,
	pointOfInterestUpdate as pointOfInterestUpdateValidationSchema,
	pointsOfInterestSearchQuery as pointsOfInterestSearchQueryValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
