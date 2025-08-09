import { z } from "zod";

import { UserValidationMessage, UserValidationRule } from "../enums/enums.js";
import { userEmailValidationSchema } from "./user-email.validation-schema.js";

const userSignIn = z.strictObject({
	email: userEmailValidationSchema,
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
});

export { userSignIn };
