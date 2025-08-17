import { RoutesValidationRule } from "./route-validation-rule.enum.js";

const RoutesValidationMessage = {
	DESCRIPTION_MAXIMUM_LENGTH: `Description more than ${String(RoutesValidationRule.NAME_MAXIMUM_LENGTH)} characters.`,
	DESCRIPTION_MINIMUM_LENGTH: `Description less than ${String(RoutesValidationRule.DESCRIPTION_MINIMUM_LENGTH)} characters.`,
	INVALID_INPUT: "Points of interest should be a number typed array",
	MAX_INPUT_LENGTH: `Input data shouldn't contain more than ${RoutesValidationRule.REQUEST_MAX_POINTS_OF_INTEREST.toString()} items.`,
	MIN_INPUT_LENGTH: `Input data should contain at least ${RoutesValidationRule.REQUEST_MIN_POINTS_OF_INTEREST.toString()} items.`,
	NAME_MAXIMUM_LENGTH: `Name more than ${String(RoutesValidationRule.NAME_MAXIMUM_LENGTH)} characters.`,
	NAME_MINIMUM_LENGTH: `Name less than ${String(RoutesValidationRule.NAME_MINIMUM_LENGTH)} characters.`,
	REQUIRED_FIELDS_FOR_UPDATE: "At least one field must be provided for update.",
	ROUTES_MINIMUM_COUNT: `There should be no less than ${String(RoutesValidationRule.ROUTES_MINIMUM_COUNT)} points.`,
} as const;

export { RoutesValidationMessage };
