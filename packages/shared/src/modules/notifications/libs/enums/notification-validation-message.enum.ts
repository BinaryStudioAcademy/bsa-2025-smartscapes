import { NotificationValidationRule } from "./notification-validation-rule.enum.js";

const NotificationValidationMessage = {
	CONTENT_MAXIMUM_LENGTH: `Content must be at most ${String(NotificationValidationRule.CONTENT_MAX_LENGTH)} characters long.`,
	CONTENT_REQUIRED: "Content cannot be empty.",
	ENTITY_ID_MUST_BE_NUMBER: "Entity ID must be a number.",
	ENTITY_ID_MUST_BE_POSITIVE: "Entity ID must be a positive integer.",
	ENTITY_TYPE_INVALID: "Invalid entity type.",
	NOTIFICATION_TYPE_INVALID: "Invalid notification type.",
	USER_ID_MUST_BE_NUMBER: "User ID must be a number.",
	USER_ID_MUST_BE_POSITIVE: "User ID must be a positive integer.",
} as const;

export { NotificationValidationMessage };
