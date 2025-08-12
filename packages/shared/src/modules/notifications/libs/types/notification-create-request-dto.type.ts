import { type ValueOf } from "../../../../libs/types/types.js";
import {
	type NotificationEntityType,
	type NotificationType,
} from "../enums/enums.js";

type NotificationCreateRequestDto = {
	content: string;
	entityId: number;
	entityType: ValueOf<typeof NotificationEntityType>;
	notificationType: ValueOf<typeof NotificationType>;
	userId: number;
};

export { type NotificationCreateRequestDto };
