import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";
import {
	type NotificationEntityType,
	type NotificationType,
} from "~/modules/notifications/libs/enums/enums.js";

class NotificationModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.NOTIFICATIONS;
	}

	public content!: string;
	public entityId!: number;
	public entityType!: ValueOf<typeof NotificationEntityType>;
	public notificationType!: ValueOf<typeof NotificationType>;
	public readAt!: null | string;
	public userId!: number;
}

export { NotificationModel };
