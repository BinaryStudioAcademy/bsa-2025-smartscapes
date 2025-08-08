import { UserExceptionMessage, type ValueOf } from "@smartscapes/shared";

import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";

type Constructor = {
	cause?: unknown;
	message?: string;
	status?: ValueOf<typeof HTTPCode>;
};

class UserError extends HTTPError {
	public constructor({
		cause,
		message = UserExceptionMessage.INVALID_CREDENTIALS,
		status = HTTPCode.UNAUTHORIZED,
	}: Constructor = {}) {
		super({ cause, message, status });
	}
}

export { UserError };
