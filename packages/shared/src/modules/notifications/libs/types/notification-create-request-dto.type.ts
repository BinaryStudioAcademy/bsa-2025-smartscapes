import { type ValueOf } from "../../../../libs/types/types.js";
import { type EntityType, type NotificationType } from "../enums/enums.js";

type NotificationCreateRequestDto = {
	content: string;
	entityId: number;
	entityType: ValueOf<typeof EntityType>;
	notificationType: ValueOf<typeof NotificationType>;
	userId: number;
};

export { type NotificationCreateRequestDto };
