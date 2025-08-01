import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class NotificationModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.NOTIFICATIONS;
	}

	public content!: string;
	public entityId!: number;
	public entityType!: string;
	public notificationType!: string;
	public readAt!: null | string;
	public userId!: number;
}

export { NotificationModel };
