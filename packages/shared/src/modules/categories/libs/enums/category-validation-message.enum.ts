import { CategoriesValidationRule } from "./catigories-validation-rule.enum.js";

const CatigoriesValidationMessage = {
	CATEGORY_INVALID_KEY:
		"Category key must contain only Latin letters without spaces.",
	CATEGORY_INVALID_NAME:
		"Category name must contain only Latin letters without spaces.",
	CATEGORY_MAXIMUM_LENGTH: `Category more than ${String(CategoriesValidationRule.CATEGORY_MAXIMUM_LENGTH)} characters.`,
	CATEGORY_MINIMUM_LENGTH: `Category less than ${String(CategoriesValidationRule.CATEGORY_MINIMUM_LENGTH)} characters.`,
} as const;

export { CatigoriesValidationMessage };
