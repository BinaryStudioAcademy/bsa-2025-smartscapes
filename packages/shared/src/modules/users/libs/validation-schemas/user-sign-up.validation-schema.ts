import { z, type ZodType } from "zod";

import { UserValidationMessage, UserValidationRule } from "../enums/enums.js";
import { type UserSignUpRequestDto } from "../types/types.js";

const userSignUp: ZodType<UserSignUpRequestDto> = z.strictObject({
	email: z
		.email({
			error: UserValidationMessage.EMAIL_WRONG,
		})
		.trim()
		.min(UserValidationRule.EMAIL_MINIMUM_LENGTH, {
			error: UserValidationMessage.EMAIL_REQUIRED,
		}),
	firstName: z
		.string()
		.trim()
		.min(UserValidationRule.FIRST_NAME_MINIMUM_LENGTH, {
			error: UserValidationMessage.FIRST_NAME_REQUIRED,
		}),
	lastName: z.string().trim().min(UserValidationRule.LAST_NAME_MINIMUM_LENGTH, {
		error: UserValidationMessage.LAST_NAME_REQUIRED,
	}),
	password: z.string().trim().min(UserValidationRule.PASSWORD_MINIMUM_LENGTH, {
		error: UserValidationMessage.PASSWORD_MINIMUM_LENGTH,
	}),
});
export { userSignUp };
