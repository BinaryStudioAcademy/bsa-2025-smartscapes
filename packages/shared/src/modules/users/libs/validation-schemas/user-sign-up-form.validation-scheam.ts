import { z, type ZodObject, type ZodRawShape } from "zod";

import { UserValidationMessage, UserValidationRule } from "../enums/enums.js";
import { userSignUp } from "./user-sign-up.validation-schema.js";

const baseSchema = userSignUp as unknown as ZodObject<ZodRawShape>;

const userSignUpForm = baseSchema
	.extend({
		confirmPassword: z
			.string()
			.trim()
			.min(UserValidationRule.PASSWORD_MINIMUM_LENGTH, {
				error: UserValidationMessage.PASSWORD_MINIMUM_LENGTH,
			}),
	})
	.refine((data) => data["password"] === data["confirmPassword"], {
		error: UserValidationMessage.PASSWORDS_DO_NOT_MATCH,
		path: ["confirmPassword"],
	});

export { userSignUpForm };
