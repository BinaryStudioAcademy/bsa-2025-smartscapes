import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	NotificationEntityType,
	NotificationType,
} from "~/modules/notifications/libs/enums/enums.js";

import { NotificationEntity } from "./notification.entity.js";
import { type NotificationRepository } from "./notification.repository.js";
import { NotificationService } from "./notification.service.js";

describe("NotificationService", () => {
	const mockNotification: Parameters<typeof NotificationEntity.initialize>[0] =
		{
			content: "Someone liked your review",
			createdAt: "2024-01-01T10:00:00Z",
			entityId: 100,
			entityType: NotificationEntityType.USERS,
			id: 1,
			notificationType: NotificationType.USER_FOLLOWED,
			readAt: null,
			updatedAt: "2024-01-01T10:00:00Z",
			userId: 42,
		};

	it("create should return new notification", async () => {
		const notificationEntity = NotificationEntity.initialize(mockNotification);

		const notificationRepository = {
			create: (() =>
				Promise.resolve(
					notificationEntity,
				)) as NotificationRepository["create"],
		} as NotificationRepository;

		const notificationService = new NotificationService(notificationRepository);

		const result = await notificationService.create({
			content: mockNotification.content,
			entityId: mockNotification.entityId,
			entityType: mockNotification.entityType,
			notificationType: mockNotification.notificationType,
			userId: mockNotification.userId,
		});

		assert.deepStrictEqual(result, notificationEntity.toObject());
	});

	it("findAllByUserId should return user notifications", async () => {
		const notificationEntity = NotificationEntity.initialize(mockNotification);

		const notificationRepository = {
			findAllByUserId: (() =>
				Promise.resolve([
					notificationEntity,
				])) as NotificationRepository["findAllByUserId"],
		} as NotificationRepository;

		const notificationService = new NotificationService(notificationRepository);

		const result = await notificationService.findAllByUserId(
			mockNotification.userId,
		);

		assert.deepStrictEqual(result, {
			items: [notificationEntity.toObject()],
		});
	});
});
