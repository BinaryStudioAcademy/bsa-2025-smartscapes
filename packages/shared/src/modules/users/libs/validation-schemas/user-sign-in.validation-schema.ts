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
		}),
	password: z.string().trim().min(UserValidationRule.PASSWORD_MINIMUM_LENGTH, {
		error: UserValidationMessage.PASSWORD_MINIMUM_LENGTH,
	}),
});

export { userSignIn };
