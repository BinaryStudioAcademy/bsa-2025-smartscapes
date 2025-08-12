import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import {
	NotificationEntityType,
	NotificationType,
} from "~/modules/notifications/libs/enums/enums.js";

import { NotificationEntity } from "./notification.entity.js";
import { NotificationModel } from "./notification.model.js";
import { NotificationRepository } from "./notification.repository.js";

describe("NotificationRepository", () => {
	let notificationRepository: NotificationRepository;
	let databaseTracker: Tracker;

	const userId = 42;

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
			userId,
		};

	beforeEach(() => {
		const database = knex({ client: MockClient });
		databaseTracker = createTracker(database);

		NotificationModel.knex(database);
		notificationRepository = new NotificationRepository(NotificationModel);
	});

	afterEach(() => {
		databaseTracker.reset();
	});

	it("create should insert and return new notification", async () => {
		const entity = NotificationEntity.initialize(mockNotification);

		databaseTracker.on.insert("notifications").response([mockNotification]);

		const result = await notificationRepository.create(entity);

		assert.deepStrictEqual(result, entity);
	});

	it("findAllByUserId should return notifications for a user", async () => {
		const expectedEntities = [NotificationEntity.initialize(mockNotification)];

		databaseTracker.on.select("notifications").response([mockNotification]);

		const result = await notificationRepository.findAllByUserId(userId);

		assert.deepStrictEqual(result, expectedEntities);
	});
});
