import { z, type ZodType } from "zod";

import {
	RoutesValidationMessage,
	RoutesValidationRule,
} from "../enums/enums.js";
import { type RoutesRequestDto } from "../types/routes-request-dto.type.js";

const routesCreate: ZodType<RoutesRequestDto> = z.strictObject({
	description: z
		.string()
		.min(RoutesValidationRule.DESCRIPTION_MINIMUM_LENGTH, {
			message: RoutesValidationMessage.DESCRIPTION_MINIMUM_LENGTH,
		})
		.max(RoutesValidationRule.DESCRIPTION_MAXIMUM_LENGTH, {
			message: RoutesValidationMessage.DESCRIPTION_MAXIMUM_LENGTH,
		}),
	name: z
		.string()
		.min(RoutesValidationRule.NAME_MINIMUM_LENGTH, {
			message: RoutesValidationMessage.NAME_MINIMUM_LENGTH,
		})
		.max(RoutesValidationRule.NAME_MAXIMUM_LENGTH, {
			message: RoutesValidationMessage.NAME_MAXIMUM_LENGTH,
		}),
	pois: z
		.array(z.number().int().positive())
		.min(RoutesValidationRule.ROUTES_MINIMUM_COUNT, {
			message: RoutesValidationMessage.ROUTES_MINIMUM_COUNT,
		}),
});

export { routesCreate };
