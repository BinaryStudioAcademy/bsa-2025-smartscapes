import { type UserAuthResponseDto } from "~/libs/types/types.js";
import { AuthError } from "~/modules/auth/libs/exceptions/unauthorized.exception.js";

import { type APIPreHandler } from "../libs/types/types.js";
import { DEBOUNCER_CONFIG } from "./libs/constants/constants.js";
import { RequestLimitError } from "./libs/exceptions/exceptions.js";

const INCREMENT = 1;

const setRateLimit = (requestsLimitPerMinute: number): APIPreHandler => {
	const userIdToRequestNumber: Map<UserAuthResponseDto["id"], number> =
		new Map();

	return ({ user }, _, done): void => {
		if (!user) {
			throw new AuthError();
		}

		const { id } = user;
		const requestsAmount = userIdToRequestNumber.get(id);

		if (!requestsAmount) {
			userIdToRequestNumber.set(id, INCREMENT);

			setTimeout(() => {
				userIdToRequestNumber.set(id, 0);
			}, DEBOUNCER_CONFIG.RESET_TIME);

			return;
		}

		if (requestsAmount === requestsLimitPerMinute) {
			throw new RequestLimitError();
		}

		userIdToRequestNumber.set(id, requestsAmount + INCREMENT);
		done();
	};
};

export { setRateLimit };
