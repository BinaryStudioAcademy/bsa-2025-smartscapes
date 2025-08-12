import { HTTPError as LibraryHTTPError } from "@smartscapes/shared";

import { type APIErrorType } from "~/libs/enums/enums.js";
import {
	type APIValidationErrorDetail,
	type ValueOf,
} from "~/libs/types/types.js";

import { type HTTPCode } from "../enums/enums.js";

type Constructor = {
	cause?: unknown;
	details: APIValidationErrorDetail[];
	message: string;
	status: ValueOf<typeof HTTPCode>;
	type: ValueOf<typeof APIErrorType>;
};

class HTTPError extends LibraryHTTPError {
	public details: APIValidationErrorDetail[];

	public type: ValueOf<typeof APIErrorType>;

	public constructor({ cause, details, message, status, type }: Constructor) {
		super({
			cause,
			message,
			status,
		});

		this.type = type;
		this.details = details;
	}
}

export { HTTPError };
