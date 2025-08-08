import { ROUTES_VALIDATION_CONFIG } from "../constants/constants.js";

const RoutesValidationMessage = {
	INVALID_INPUT: "Points of interest should be a number typed array",
	MAX_INPUT_LENGTH: `Input data shouldn't containt more than ${ROUTES_VALIDATION_CONFIG.REQUEST_MAX_POINTS_OF_INTEREST.toString()} items.`,
	MIN_INPUT_LENGTH: `Input data should contain at least ${ROUTES_VALIDATION_CONFIG.REQUEST_MIN_POINTS_OF_INTEREST.toString()} items.`,
} as const;

export { RoutesValidationMessage };
