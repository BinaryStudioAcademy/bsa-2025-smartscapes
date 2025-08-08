import { type APIErrorType } from "~/libs/enums/enums.js";
import { type HTTPCode } from "~/libs/modules/http/http.js";
import {
	type APIValidationErrorDetail,
	type ValueOf,
} from "~/libs/types/types.js";

import { HTTPError } from "./http-error.exception.js";

type Constructor = {
	cause?: unknown;
	details: APIValidationErrorDetail[];
	message: string;
	name?: string;
	status: ValueOf<typeof HTTPCode>;
	type: ValueOf<typeof APIErrorType>;
};

const AUTH_ERROR_DEFAULT_NAME = "Unauthorized";

class AuthError extends HTTPError {
	public name: string;

	public constructor({
		cause,
		details,
		message,
		name = AUTH_ERROR_DEFAULT_NAME,
		status,
		type,
	}: Constructor) {
		super({ cause, details, message, status, type });
		this.name = name;
	}
}

export { AUTH_ERROR_DEFAULT_NAME, AuthError };
