import { z } from "zod";

import {
	CategoriesValidationRule,
	CatigoriesValidationMessage,
} from "../enums/enums.js";

const categoryCreate = z.object({
	key: z
		.string()
		.regex(/^[a-zA-Z-]+$/, {
			message: CatigoriesValidationMessage.CATEGORY_INVALID_NAME,
		})
		.min(CategoriesValidationRule.CATEGORY_MINIMUM_LENGTH, {
			message: CatigoriesValidationMessage.CATEGORY_MINIMUM_LENGTH,
		})
		.max(CategoriesValidationRule.CATEGORY_MAXIMUM_LENGTH, {
			message: CatigoriesValidationMessage.CATEGORY_MAXIMUM_LENGTH,
		}),
	name: z
		.string()
		.regex(/^[a-zA-Z-]+$/, {
			message: CatigoriesValidationMessage.CATEGORY_INVALID_KEY,
		})
		.min(CategoriesValidationRule.CATEGORY_MINIMUM_LENGTH, {
			message: CatigoriesValidationMessage.CATEGORY_MINIMUM_LENGTH,
		})
		.max(CategoriesValidationRule.CATEGORY_MAXIMUM_LENGTH, {
			message: CatigoriesValidationMessage.CATEGORY_MAXIMUM_LENGTH,
		}),
});

export { categoryCreate };
