import { z } from "zod";

import { checkIsLatinLetter } from "../../../../libs/helpers/helpers.js";
import { UserValidationMessage } from "../enums/user-validation-message.enum.js";
import { UserValidationRule } from "../enums/user-validation-rule.enum.js";

const authenticatedUserPatch = z
	.object({
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
			})
			.optional(),
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
			})
			.optional(),
	})
	.refine((data) => data.firstName || data.lastName, {
		message: UserValidationMessage.FIRST_OR_LAST_NAME_REQUIRED,
	});

export { authenticatedUserPatch };
