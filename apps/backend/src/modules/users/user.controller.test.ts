import { GroupKey } from "@smartscapes/shared";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { GroupEntity } from "../groups/group.entity.js";
import { PermissionEntity } from "../permission/permission.entity.js";
import { UserController } from "./user.controller.js";
import { type UserService } from "./user.service.js";

describe("UserController", () => {
	const mockLogger: Logger = {
		debug: () => {},
		error: () => {},
		info: () => {},
		warn: () => {},
	};

	const mockPermission = PermissionEntity.initialize({
		id: 1,
		key: "read",
		name: "Read",
	});

	const mockGroup = GroupEntity.initializeWithPermissions({
		id: 2,
		key: GroupKey.USERS,
		name: "Users",
		permissions: [mockPermission.toObject()],
	});

	it("findAll should return all users", async () => {
		const users = [
			{
				email: "test@example.com",
				firstName: "John",
				group: mockGroup.toObject(),
				groupId: 2,
				id: 1,
				lastName: "Doe",
			},
		];

		const mockFindAll: UserService["findAll"] = () => {
			return Promise.resolve({ items: users });
		};

		const userService = {
			findAll: mockFindAll,
		} as UserService;

		const userController = new UserController(mockLogger, userService);

		const result = await userController.findAll();

		assert.deepStrictEqual(result, {
			payload: {
				data: users,
			},
			status: HTTPCode.OK,
		});
	});
});
