import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type UserAuthResponseDto } from "~/libs/types/types.js";
import {
	EntityType,
	NotificationType,
} from "~/modules/notifications/libs/enums/enums.js";
import {
	type NotificationCreateRequestDto,
	type NotificationGetAllItemResponseDto,
} from "~/modules/notifications/libs/types/types.js";

import { NotificationController } from "./notification.controller.js";
import { type NotificationService } from "./notification.service.js";

describe("NotificationController", () => {
	const mockLogger: Logger = {
		debug: () => {},
		error: () => {},
		info: () => {},
		warn: () => {},
	};

	const mockUser: UserAuthResponseDto = {
		email: "example@example.com",
		firstName: "John",
		id: 42,
		lastName: "Doe",
	};

	it("create should return created notification", async () => {
		const mockNotification: NotificationGetAllItemResponseDto = {
			content: "Test content",
			createdAt: new Date().toISOString(),
			entityId: 100,
			entityType: EntityType.USERS,
			id: 1,
			notificationType: NotificationType.USER_FOLLOWED,
			readAt: null,
			updatedAt: new Date().toISOString(),
			userId: 42,
		};

		const mockCreate: NotificationService["create"] = () => {
			return Promise.resolve(mockNotification);
		};

		const notificationService = {
			create: mockCreate,
		} as NotificationService;

		const controller = new NotificationController(
			mockLogger,
			notificationService,
		);

		const dto: NotificationCreateRequestDto = {
			content: "Test content",
			entityId: 100,
			entityType: EntityType.USERS,
			notificationType: NotificationType.USER_FOLLOWED,
			userId: 42,
		};

		const result = await controller.create({
			body: dto,
			params: {},
			query: {},
			user: mockUser,
		});

		assert.deepStrictEqual(result, {
			payload: { data: mockNotification },
			status: HTTPCode.CREATED,
		});
	});

	it("findAllByUserId should return user's notifications", async () => {
		const notifications: NotificationGetAllItemResponseDto[] = [
			{
				content: "You've got a reply",
				createdAt: new Date().toISOString(),
				entityId: 101,
				entityType: EntityType.USERS,
				id: 1,
				notificationType: NotificationType.USER_FOLLOWED,
				readAt: null,
				updatedAt: new Date().toISOString(),
				userId: 42,
			},
		];

		const mockFindAllByUserId: NotificationService["findAllByUserId"] = () => {
			return Promise.resolve({ items: notifications });
		};

		const notificationService = {
			findAllByUserId: mockFindAllByUserId,
		} as NotificationService;

		const controller = new NotificationController(
			mockLogger,
			notificationService,
		);

		const result = await controller.findAllByUserId({
			body: {},
			params: {},
			query: {},
			user: mockUser,
		});

		assert.deepStrictEqual(result, {
			payload: { data: { items: notifications } },
			status: HTTPCode.OK,
		});
	});
});
