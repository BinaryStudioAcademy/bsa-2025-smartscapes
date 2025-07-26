import { z, type ZodType } from "zod";

import { UserValidationMessage, UserValidationRule } from "../enums/enums.js";
import { type UserSignInRequestDto } from "../types/types.js";

const userSignIn: ZodType<UserSignInRequestDto> = z.strictObject({
	email: z
		.email({
			error: UserValidationMessage.EMAIL_WRONG,
		})
		.trim()
		.min(UserValidationRule.EMAIL_MINIMUM_LENGTH, {
			error: UserValidationMessage.EMAIL_REQUIRED,
		})
		.max(UserValidationRule.MAX_LENGTH, {
			error: UserValidationMessage.EMAIL_MAXIMUM_LENGTH,
		}),
	password: z
		.string()
		.trim()
		.min(UserValidationRule.PASSWORD_MINIMUM_LENGTH, {
			error: UserValidationMessage.PASSWORD_MINIMUM_LENGTH,
		})
		.max(UserValidationRule.MAX_LENGTH, {
			error: UserValidationMessage.PASSWORD_MAXIMUM_LENGTH,
		}),
});

export { userSignIn };
