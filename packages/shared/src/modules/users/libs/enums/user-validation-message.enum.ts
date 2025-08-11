import { UserValidationRule } from "./user-validation-rule.enum.js";

const UserValidationMessage = {
	EMAIL_DOMAIN_NOT_ALLOWED:
		"Email addresses with such domains are not allowed.",
	EMAIL_MAXIMUM_LENGTH: `Email must be at most ${String(UserValidationRule.MAX_LENGTH)} characters long.`,
	EMAIL_MINIMUM_LENGTH: `Email must be at least ${String(UserValidationRule.EMAIL_MINIMUM_LENGTH)} characters long.`,
	EMAIL_REQUIRED: "Email is required.",
	EMAIL_WRONG: "Email format is wrong.",
	FIRST_NAME_INVALID: "First name must contain only Latin letters.",
	FIRST_NAME_MAXIMUM_LENGTH: `First name must be at most ${String(UserValidationRule.MAX_LENGTH)} characters long`,
	FIRST_NAME_MINIMUM_LENGTH: `First name must be at least ${String(UserValidationRule.FIRST_NAME_MINIMUM_LENGTH)} characters long.`,
	FIRST_NAME_REQUIRED: "First name is required.",
	FIRST_OR_LAST_NAME_REQUIRED:
		"At least one of firstName or lastName is required.",
	LAST_NAME_INVALID: "Last name must contain only Latin letters.",
	LAST_NAME_MAXIMUM_LENGTH: `Last name must be at most ${String(UserValidationRule.MAX_LENGTH)} characters long.`,
	LAST_NAME_MINIMUM_LENGTH: `Last name must be at least ${String(UserValidationRule.LAST_NAME_MINIMUM_LENGTH)} characters long.`,
	LAST_NAME_REQUIRED: "Last name is required.",
	PASSWORD_MAXIMUM_LENGTH: `Password must be at most ${String(UserValidationRule.MAX_LENGTH)} characters long.`,
	PASSWORD_MINIMUM_LENGTH: `Password must be at least ${String(UserValidationRule.PASSWORD_MINIMUM_LENGTH)} characters long.`,
	PASSWORD_REQUIRED: "Password is required.",
	PASSWORDS_DO_NOT_MATCH: "Passwords do not match.",
} as const;

export { UserValidationMessage };
