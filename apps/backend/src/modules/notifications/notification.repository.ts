import { type Repository, type ValueOf } from "~/libs/types/types.js";
import {
	type NotificationEntityType,
	type NotificationType,
} from "~/modules/notifications/libs/enums/enums.js";

import { NotificationEntity } from "./notification.entity.js";
import { type NotificationModel } from "./notification.model.js";

class NotificationRepository implements Repository {
	private notificationModel: typeof NotificationModel;

	public constructor(notificationModel: typeof NotificationModel) {
		this.notificationModel = notificationModel;
	}

	public async create(entity: NotificationEntity): Promise<NotificationEntity> {
		const plainObject = entity.toNewObject();

		const newNotification = await this.notificationModel
			.query()
			.insert(plainObject)
			.returning("*")
			.execute();

		return NotificationEntity.initialize({
			content: newNotification.content,
			createdAt: newNotification.createdAt,
			entityId: newNotification.entityId,
			entityType: newNotification.entityType as ValueOf<
				typeof NotificationEntityType
			>,
			id: newNotification.id,
			notificationType: newNotification.notificationType as ValueOf<
				typeof NotificationType
			>,
			readAt: newNotification.readAt,
			updatedAt: newNotification.updatedAt,
			userId: newNotification.userId,
		});
	}

	public async findAllByUserId(userId: number): Promise<NotificationEntity[]> {
		const notifications = await this.notificationModel
			.query()
			.where("user_id", userId)
			.orderBy("created_at", "desc")
			.execute();

		return notifications.map((notification) =>
			NotificationEntity.initialize({
				content: notification.content,
				createdAt: notification.createdAt,
				entityId: notification.entityId,
				entityType: notification.entityType as ValueOf<
					typeof NotificationEntityType
				>,
				id: notification.id,
				notificationType: notification.notificationType as ValueOf<
					typeof NotificationType
				>,
				readAt: notification.readAt,
				updatedAt: notification.updatedAt,
				userId: notification.userId,
			}),
		);
	}
}

export { NotificationRepository };
