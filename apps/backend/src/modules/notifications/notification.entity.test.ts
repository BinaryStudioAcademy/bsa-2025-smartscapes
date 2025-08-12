import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	NotificationEntityType,
	NotificationType,
} from "~/modules/notifications/libs/enums/enums.js";

import { NotificationEntity } from "./notification.entity.js";

describe("NotificationEntity", () => {
	const mockNewNotificationPayload = {
		content: "User 10 followed you!",
		entityId: 10,
		entityType: NotificationEntityType.USERS,
		notificationType: NotificationType.USER_FOLLOWED,
		userId: 1,
	};

	const mockExistingNotificationData = {
		content: "User 20 followed you!",
		createdAt: "2023-01-01T10:00:00.000Z",
		entityId: 20,
		entityType: NotificationEntityType.USERS,
		id: 1,
		notificationType: NotificationType.USER_FOLLOWED,
		readAt: null,
		updatedAt: "2023-01-01T10:00:00.000Z",
		userId: 2,
	};

	it("should initialize a new notification entity and return an object suitable for database insertion", () => {
		const newEntity = NotificationEntity.initializeNew(
			mockNewNotificationPayload,
		);
		const newObject = newEntity.toNewObject();

		assert.deepStrictEqual(newObject, {
			content: mockNewNotificationPayload.content,
			entityId: mockNewNotificationPayload.entityId,
			entityType: mockNewNotificationPayload.entityType,
			notificationType: mockNewNotificationPayload.notificationType,
			readAt: null,
			userId: mockNewNotificationPayload.userId,
		});
		assert.strictEqual("id" in newObject, false);
		assert.strictEqual("createdAt" in newObject, false);
		assert.strictEqual("updatedAt" in newObject, false);
	});

	it("should initialize an existing notification entity and return a DTO for API response", () => {
		const existingEntity = NotificationEntity.initialize(
			mockExistingNotificationData,
		);
		const dto = existingEntity.toObject();

		assert.deepStrictEqual(dto, {
			content: mockExistingNotificationData.content,
			createdAt: mockExistingNotificationData.createdAt,
			entityId: mockExistingNotificationData.entityId,
			entityType: mockExistingNotificationData.entityType,
			id: mockExistingNotificationData.id,
			notificationType: mockExistingNotificationData.notificationType,
			readAt: mockExistingNotificationData.readAt,
			updatedAt: mockExistingNotificationData.updatedAt,
			userId: mockExistingNotificationData.userId,
		});
	});
});
