import { z } from "zod";

import {
	RoutesValidationMessage,
	RoutesValidationRule,
} from "../enums/enums.js";

const routesConstruct = z.object({
	pointsOfInterest: z
		.array(z.number({ message: RoutesValidationMessage.INVALID_INPUT }), {
			message: RoutesValidationMessage.INVALID_INPUT,
		})
		.min(RoutesValidationRule.REQUEST_MIN_POINTS_OF_INTEREST, {
			message: RoutesValidationMessage.MIN_INPUT_LENGTH,
		})
		.max(RoutesValidationRule.REQUEST_MAX_POINTS_OF_INTEREST, {
			message: RoutesValidationMessage.MAX_INPUT_LENGTH,
		}),
});

export { routesConstruct };
