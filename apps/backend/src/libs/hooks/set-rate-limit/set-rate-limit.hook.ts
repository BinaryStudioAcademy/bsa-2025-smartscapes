import { type APIPreHandler } from "~/libs/modules/controller/libs/types/types.js";
import { type UserAuthResponseDto } from "~/libs/types/types.js";
import { AuthError } from "~/modules/auth/libs/exceptions/auth.exception.js";

import { RATE_LIMIT_TIME_PERIOD } from "./libs/constants/constants.js";
import { RateLimitError } from "./libs/exceptions/exceptions.js";

const REQUEST_NUMBER_INITIAL_VALUE = 0;
const REQUEST_NUMBER_INCREMENT_VALUE = 1;

const setRateLimit = (requestsLimitPerMinute: number): APIPreHandler => {
	const userIdToRequestNumber: Map<UserAuthResponseDto["id"], number> =
		new Map();

	return ({ user }, done): void => {
		if (!user) {
			throw new AuthError();
		}

		const { id } = user;
		const requestsNumber = userIdToRequestNumber.get(id);

		if (!requestsNumber) {
			userIdToRequestNumber.set(id, REQUEST_NUMBER_INCREMENT_VALUE);

			setTimeout(() => {
				userIdToRequestNumber.set(id, REQUEST_NUMBER_INITIAL_VALUE);
			}, RATE_LIMIT_TIME_PERIOD);

			return;
		}

		if (requestsNumber >= requestsLimitPerMinute) {
			throw new RateLimitError();
		}

		userIdToRequestNumber.set(
			id,
			requestsNumber + REQUEST_NUMBER_INCREMENT_VALUE,
		);
		done();
	};
};

export { setRateLimit };
