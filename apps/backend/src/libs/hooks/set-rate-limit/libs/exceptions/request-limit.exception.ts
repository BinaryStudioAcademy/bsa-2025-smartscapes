import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { type ValueOf } from "~/libs/types/types.js";

import { RateLimitErrorMessage } from "../enums/enums.js";

type Constructor = {
	cause?: unknown;
	message?: string;
	status?: ValueOf<typeof HTTPCode>;
};

class RateLimitError extends HTTPError {
	public constructor({
		cause,
		message = RateLimitErrorMessage.LIMIT_REACHED,
		status = HTTPCode.TOO_MANY_REQUESTS,
	}: Constructor = {}) {
		super({ cause, message, status });
	}
}

export { RateLimitError };
