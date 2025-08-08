import { z } from "zod";

import { ROUTES_VALIDATION_CONFIG } from "./libs/constants/constants.js";
import { RoutesValidationMessage } from "./libs/enums/enums.js";

const constructRouteValidationSchema = z.object({
	pointsOfInterest: z
		.array(z.number({ message: RoutesValidationMessage.INVALID_INPUT }), {
			message: RoutesValidationMessage.INVALID_INPUT,
		})
		.min(ROUTES_VALIDATION_CONFIG.REQUEST_MIN_POINTS_OF_INTEREST, {
			message: RoutesValidationMessage.MIN_INPUT_LENGTH,
		})
		.max(ROUTES_VALIDATION_CONFIG.REQUEST_MAX_POINTS_OF_INTEREST, {
			message: RoutesValidationMessage.MAX_INPUT_LENGTH,
		}),
});

export { constructRouteValidationSchema };
