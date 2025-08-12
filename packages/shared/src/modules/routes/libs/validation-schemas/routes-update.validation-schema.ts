import { z } from "zod";

import {
	RoutesValidationMessage,
	RoutesValidationRule,
} from "../enums/enums.js";

const MINIMUM_FIELDS_TO_UPDATE = 1;

const routesUpdate = z
	.strictObject({
		description: z
			.string()
			.trim()
			.min(RoutesValidationRule.DESCRIPTION_MINIMUM_LENGTH, {
				message: RoutesValidationMessage.DESCRIPTION_MINIMUM_LENGTH,
			})
			.max(RoutesValidationRule.DESCRIPTION_MAXIMUM_LENGTH, {
				message: RoutesValidationMessage.DESCRIPTION_MAXIMUM_LENGTH,
			})
			.optional(),
		name: z
			.string()
			.trim()
			.min(RoutesValidationRule.NAME_MINIMUM_LENGTH, {
				message: RoutesValidationMessage.NAME_MINIMUM_LENGTH,
			})
			.max(RoutesValidationRule.NAME_MAXIMUM_LENGTH, {
				message: RoutesValidationMessage.NAME_MAXIMUM_LENGTH,
			})
			.optional(),
	})
	.refine(
		(data) => {
			return Object.keys(data).length >= MINIMUM_FIELDS_TO_UPDATE;
		},
		{
			message: RoutesValidationMessage.REQUIRED_FIELDS_FOR_UPDATE,
		},
	);

export { routesUpdate };
