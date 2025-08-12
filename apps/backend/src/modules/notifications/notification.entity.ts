import { type Entity, type ValueOf } from "~/libs/types/types.js";
import {
	type NotificationEntityType,
	type NotificationType,
} from "~/modules/notifications/libs/enums/enums.js";

class NotificationEntity implements Entity {
	private content: string;

	private createdAt: null | string;

	private entityId: number;

	private entityType: ValueOf<typeof NotificationEntityType>;

	private id: null | number;

	private notificationType: ValueOf<typeof NotificationType>;

	private readAt: null | string;

	private updatedAt: null | string;

	private userId: number;

	private constructor({
		content,
		createdAt,
		entityId,
		entityType,
		id,
		notificationType,
		readAt,
		updatedAt,
		userId,
	}: {
		content: string;
		createdAt: null | string;
		entityId: number;
		entityType: ValueOf<typeof NotificationEntityType>;
		id: null | number;
		notificationType: ValueOf<typeof NotificationType>;
		readAt: null | string;
		updatedAt: null | string;
		userId: number;
	}) {
		this.content = content;
		this.createdAt = createdAt;
		this.entityId = entityId;
		this.entityType = entityType;
		this.id = id;
		this.notificationType = notificationType;
		this.readAt = readAt;
		this.updatedAt = updatedAt;
		this.userId = userId;
	}

	public static initialize({
		content,
		createdAt,
		entityId,
		entityType,
		id,
		notificationType,
		readAt,
		updatedAt,
		userId,
	}: {
		content: string;
		createdAt: string;
		entityId: number;
		entityType: ValueOf<typeof NotificationEntityType>;
		id: number;
		notificationType: ValueOf<typeof NotificationType>;
		readAt: null | string;
		updatedAt: string;
		userId: number;
	}): NotificationEntity {
		return new NotificationEntity({
			content,
			createdAt,
			entityId,
			entityType,
			id,
			notificationType,
			readAt,
			updatedAt,
			userId,
		});
	}

	public static initializeNew({
		content,
		entityId,
		entityType,
		notificationType,
		userId,
	}: {
		content: string;
		entityId: number;
		entityType: ValueOf<typeof NotificationEntityType>;
		notificationType: ValueOf<typeof NotificationType>;
		userId: number;
	}): NotificationEntity {
		return new NotificationEntity({
			content,
			createdAt: null,
			entityId,
			entityType,
			id: null,
			notificationType,
			readAt: null,
			updatedAt: null,
			userId,
		});
	}

	public toNewObject(): {
		content: string;
		entityId: number;
		entityType: ValueOf<typeof NotificationEntityType>;
		notificationType: ValueOf<typeof NotificationType>;
		readAt: null | string;
		userId: number;
	} {
		return {
			content: this.content,
			entityId: this.entityId,
			entityType: this.entityType,
			notificationType: this.notificationType,
			readAt: this.readAt,
			userId: this.userId,
		};
	}

	public toObject(): {
		content: string;
		createdAt: string;
		entityId: number;
		entityType: ValueOf<typeof NotificationEntityType>;
		id: number;
		notificationType: ValueOf<typeof NotificationType>;
		readAt: null | string;
		updatedAt: string;
		userId: number;
	} {
		return {
			content: this.content,
			createdAt: this.createdAt as string,
			entityId: this.entityId,
			entityType: this.entityType,
			id: this.id as number,
			notificationType: this.notificationType,
			readAt: this.readAt,
			updatedAt: this.updatedAt as string,
			userId: this.userId,
		};
	}
}

export { NotificationEntity };
