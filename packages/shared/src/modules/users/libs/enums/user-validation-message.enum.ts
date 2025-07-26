import { UserValidationRule } from "./user-validation-rule.enum.js";

const UserValidationMessage = {
	EMAIL_REQUIRED: "Email is required.",
	EMAIL_WRONG: "Email format is wrong.",
	FIRST_NAME_REQUIRED: "First name is required.",
	LAST_NAME_REQUIRED: "Last name is required.",
	PASSWORD_MINIMUM_LENGTH: `Password must be at least ${String(UserValidationRule.PASSWORD_MINIMUM_LENGTH)} characters long.`,
	PASSWORDS_DO_NOT_MATCH: "Passwords do not match.",
} as const;

export { UserValidationMessage };
