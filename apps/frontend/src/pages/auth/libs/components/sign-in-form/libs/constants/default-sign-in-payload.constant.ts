import { type UserSignInRequestDto } from "~/modules/users/users.js";

type SignInFormValues = UserSignInRequestDto;

const DEFAULT_SIGN_IN_PAYLOAD: SignInFormValues = {
	email: "",
	password: "",
};

export { DEFAULT_SIGN_IN_PAYLOAD };
