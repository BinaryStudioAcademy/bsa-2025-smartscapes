import { type UserSignUpRequestDto } from "@smartscapes/shared/src/modules/users/libs/types/user-sign-up-request-dto.type.js";

type UserSignUpFormValues = UserSignUpRequestDto & {
	confirmPassword: string;
};

export { type UserSignUpFormValues };
