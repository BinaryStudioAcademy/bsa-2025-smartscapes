import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { type ValueOf } from "~/libs/types/types.js";

import { DebouncerErrorMessage } from "../enums/enums.js";

type Constructor = {
	cause?: unknown;
	message?: string;
	status?: ValueOf<typeof HTTPCode>;
};

class RequestLimitError extends HTTPError {
	public constructor({
		cause,
		message = DebouncerErrorMessage.LIMIT_REACHED,
		status = HTTPCode.TOO_MANY_REQUESTS,
	}: Constructor = {}) {
		super({ cause, message, status });
	}
}

export { RequestLimitError };
