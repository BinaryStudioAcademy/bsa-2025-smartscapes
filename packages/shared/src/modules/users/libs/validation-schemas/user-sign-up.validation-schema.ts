import { z } from "zod";

import { checkIsLatinLetter } from "../../../../libs/helpers/helpers.js";
import { UserValidationMessage, UserValidationRule } from "../enums/enums.js";
import { userEmailValidationSchema } from "./user-email.validation-schema.js";

const userSignUp = z
	.strictObject({
		confirmPassword: z
			.string()
			.trim()
			.min(UserValidationRule.REQUIRED_STRING_MIN_LENGTH, {
				error: UserValidationMessage.PASSWORD_REQUIRED,
			})
			.min(UserValidationRule.PASSWORD_MINIMUM_LENGTH, {
				error: UserValidationMessage.PASSWORD_MINIMUM_LENGTH,
			})
			.max(UserValidationRule.MAX_LENGTH, {
				error: UserValidationMessage.PASSWORD_MAXIMUM_LENGTH,
			}),
		email: userEmailValidationSchema,
		firstName: z
			.string()
			.trim()
			.min(UserValidationRule.REQUIRED_STRING_MIN_LENGTH, {
				error: UserValidationMessage.FIRST_NAME_REQUIRED,
			})
			.min(UserValidationRule.FIRST_NAME_MINIMUM_LENGTH, {
				error: UserValidationMessage.FIRST_NAME_MINIMUM_LENGTH,
			})
			.max(UserValidationRule.MAX_LENGTH, {
				error: UserValidationMessage.FIRST_NAME_MAXIMUM_LENGTH,
			})
			.refine(checkIsLatinLetter, {
				message: UserValidationMessage.FIRST_NAME_INVALID,
			}),
		lastName: z
			.string()
			.trim()
			.min(UserValidationRule.REQUIRED_STRING_MIN_LENGTH, {
				error: UserValidationMessage.LAST_NAME_REQUIRED,
			})
			.min(UserValidationRule.LAST_NAME_MINIMUM_LENGTH, {
				error: UserValidationMessage.LAST_NAME_MINIMUM_LENGTH,
			})
			.max(UserValidationRule.MAX_LENGTH, {
				error: UserValidationMessage.LAST_NAME_MAXIMUM_LENGTH,
			})
			.refine(checkIsLatinLetter, {
				message: UserValidationMessage.LAST_NAME_INVALID,
			}),
		password: z
			.string()
			.trim()
			.min(UserValidationRule.REQUIRED_STRING_MIN_LENGTH, {
				error: UserValidationMessage.PASSWORD_REQUIRED,
			})
			.min(UserValidationRule.PASSWORD_MINIMUM_LENGTH, {
				error: UserValidationMessage.PASSWORD_MINIMUM_LENGTH,
			})
			.max(UserValidationRule.MAX_LENGTH, {
				error: UserValidationMessage.PASSWORD_MAXIMUM_LENGTH,
			}),
	})
	.refine((data) => data["password"] === data["confirmPassword"], {
		error: UserValidationMessage.PASSWORDS_DO_NOT_MATCH,
		path: ["confirmPassword"],
	});

export { userSignUp };
