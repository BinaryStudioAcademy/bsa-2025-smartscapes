import { type authApi } from "~/modules/auth/auth.js";
import { type userApi } from "~/modules/users/users.js";

type ExtraArguments = {
	authApi: typeof authApi;
	userApi: typeof userApi;
};

export { type ExtraArguments };
