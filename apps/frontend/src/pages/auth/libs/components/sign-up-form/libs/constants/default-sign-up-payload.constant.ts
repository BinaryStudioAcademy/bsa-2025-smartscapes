import { type UserSignUpFormValues } from "~/pages/auth/libs/types/user-sign-up-form-values.types.js";

const DEFAULT_SIGN_UP_PAYLOAD: UserSignUpFormValues = {
	confirmPassword: "",
	email: "",
	firstName: "",
	lastName: "",
	password: "",
};

export { DEFAULT_SIGN_UP_PAYLOAD };
