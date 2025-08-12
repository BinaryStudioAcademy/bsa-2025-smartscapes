import { z } from "zod";

import {
	NotificationEntityType,
	NotificationType,
	NotificationValidationMessage,
	NotificationValidationRule,
} from "../enums/enums.js";

const notificationCreate = z.strictObject({
	content: z
		.string()
		.trim()
		.min(NotificationValidationRule.CONTENT_MIN_LENGTH, {
			message: NotificationValidationMessage.CONTENT_REQUIRED,
		})
		.max(NotificationValidationRule.CONTENT_MAX_LENGTH, {
			message: NotificationValidationMessage.CONTENT_MAXIMUM_LENGTH,
		}),
	entityId: z
		.number()
		.int({
			message: NotificationValidationMessage.ENTITY_ID_MUST_BE_NUMBER,
		})
		.positive({
			message: NotificationValidationMessage.ENTITY_ID_MUST_BE_POSITIVE,
		}),
	entityType: z.enum(
		Object.values(NotificationEntityType) as [string, ...string[]],
		{
			message: NotificationValidationMessage.ENTITY_TYPE_INVALID,
		},
	),
	notificationType: z.enum(
		Object.values(NotificationType) as [string, ...string[]],
		{
			message: NotificationValidationMessage.NOTIFICATION_TYPE_INVALID,
		},
	),
	userId: z
		.number()
		.int({
			message: NotificationValidationMessage.USER_ID_MUST_BE_NUMBER,
		})
		.positive({
			message: NotificationValidationMessage.USER_ID_MUST_BE_POSITIVE,
		}),
});

export { notificationCreate };
