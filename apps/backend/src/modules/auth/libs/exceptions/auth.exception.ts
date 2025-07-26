import { HTTPCode, HTTPError, type ValueOf } from "@smartscapes/shared";

import { AuthorizationExceptionMessage } from "../enums/auth-exception-message.enum.js";

type Constructor = {
	cause?: unknown;
	message?: string;
	status?: ValueOf<typeof HTTPCode>;
};

class AuthorizationError extends HTTPError {
	public constructor({
		cause,
		message = AuthorizationExceptionMessage.INVALID_CREDENTIALS,
		status = HTTPCode.UNATHORIZED,
	}: Constructor = {}) {
		super({ cause, message, status });
	}
}

export { AuthorizationError };
