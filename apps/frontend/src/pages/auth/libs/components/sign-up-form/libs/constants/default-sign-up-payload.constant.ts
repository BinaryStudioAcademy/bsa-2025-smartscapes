import { type UserSignUpRequestDto } from "@smartscapes/shared";

const DEFAULT_SIGN_UP_PAYLOAD: UserSignUpRequestDto = {
	confirmPassword: "",
	email: "",
	firstName: "",
	lastName: "",
	password: "",
};

export { DEFAULT_SIGN_UP_PAYLOAD };
