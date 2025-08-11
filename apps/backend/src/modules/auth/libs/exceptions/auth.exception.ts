import { HTTPCode } from "~/libs/enums/enums.js";
import { HTTPError } from "~/libs/modules/http/http.js";
import { type ValueOf } from "~/libs/types/types.js";

import { AuthExceptionMessage } from "../enums/enums.js";

type Constructor = {
	cause?: unknown;
	message?: string;
	status?: ValueOf<typeof HTTPCode>;
};

class AuthError extends HTTPError {
	public constructor({
		cause,
		message = AuthExceptionMessage.UNAUTHORIZED_REQUEST,
		status = HTTPCode.UNAUTHORIZED,
	}: Constructor = {}) {
		super({ cause, message, status });
	}
}

export { AuthError };
