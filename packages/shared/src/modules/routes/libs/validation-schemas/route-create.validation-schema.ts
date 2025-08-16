import { z } from "zod";

import {
	RoutesValidationMessage,
	RoutesValidationRule,
} from "../enums/enums.js";

const routesCreate = z.strictObject({
	description: z
		.string()
		.trim()
		.min(RoutesValidationRule.DESCRIPTION_MINIMUM_LENGTH, {
			message: RoutesValidationMessage.DESCRIPTION_MINIMUM_LENGTH,
		})
		.max(RoutesValidationRule.DESCRIPTION_MAXIMUM_LENGTH, {
			message: RoutesValidationMessage.DESCRIPTION_MAXIMUM_LENGTH,
		}),
	name: z
		.string()
		.trim()
		.min(RoutesValidationRule.NAME_MINIMUM_LENGTH, {
			message: RoutesValidationMessage.NAME_MINIMUM_LENGTH,
		})
		.max(RoutesValidationRule.NAME_MAXIMUM_LENGTH, {
			message: RoutesValidationMessage.NAME_MAXIMUM_LENGTH,
		}),
	plannedPathId: z.number({
		message: RoutesValidationMessage.PLANNED_ROUTE_INVALID_TYPE,
	}),
	poiIds: z
		.array(z.number().int().positive())
		.min(RoutesValidationRule.ROUTES_MINIMUM_COUNT, {
			message: RoutesValidationMessage.ROUTES_MINIMUM_COUNT,
		}),
	userId: z.number({
		message: RoutesValidationMessage.USER_ID_INVALID_TYPE,
	}),
});

export { routesCreate };
