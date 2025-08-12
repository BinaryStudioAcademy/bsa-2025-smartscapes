import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GroupEntity } from "../groups/group.entity.js";
import { type GroupService } from "../groups/group.service.js";
import { PermissionEntity } from "../permission/permission.entity.js";
import { UserEntity } from "./user.entity.js";
import { type UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";

describe("UserService", () => {
	const mockPermission = PermissionEntity.initialize({
		id: 1,
		key: "read",
		name: "Read",
	});

	const mockGroup = GroupEntity.initializeWithPermissions({
		id: 2,
		key: "users",
		name: "Users",
		permissions: [mockPermission.toObject()],
	});

	const mockUser = UserEntity.initialize({
		email: "test@example.com",
		firstName: "John",
		group: mockGroup.toObject(),
		groupId: 2,
		id: 1,
		lastName: "Doe",
		passwordHash: "hash",
		passwordSalt: "salt",
	});

	const mockGroupService = {
		findByKey: () => mockGroup.toObject(),
	} as unknown as GroupService;

	it("create should return new user", async () => {
		const userEntity = UserEntity.initialize({
			email: "test@example.com",
			firstName: "John",
			group: mockGroup.toObject(),
			groupId: 2,
			id: 1,
			lastName: "Doe",
			passwordHash: "hash",
			passwordSalt: "salt",
		});

		const userRepository: UserRepository = {
			create: () => userEntity,
			findAll: () => [],
			findByEmail: () => null,
			findById: () => userEntity,
			findPasswordDetails: () => null,
		} as unknown as UserRepository;

		const userService = new UserService(userRepository, mockGroupService);

		const result = await userService.create({
			confirmPassword: "Password",
			email: mockUser.toObject().email,
			firstName: mockUser.toObject().firstName,
			lastName: mockUser.toObject().lastName,
			password: "Password",
		});

		assert.deepStrictEqual(result, {
			email: mockUser.toObject().email,
			firstName: mockUser.toObject().firstName,
			group: {
				id: 2,
				key: "users",
				name: "Users",
				permissions: [{ id: 1, key: "read", name: "Read" }],
			},
			groupId: mockUser.toObject().groupId,
			id: mockUser.toObject().id,
			lastName: mockUser.toObject().lastName,
		});
	});

	it("findAll should return all users", async () => {
		const userEntity = UserEntity.initialize({
			email: "test@example.com",
			firstName: "John",
			group: mockGroup.toObject(),
			groupId: 2,
			id: 1,
			lastName: "Doe",
			passwordHash: "hash",
			passwordSalt: "salt",
		});

		const userRepository = {
			findAll: () => {
				return [userEntity];
			},
		} as unknown as UserRepository;

		const userService = new UserService(userRepository, mockGroupService);

		const result = await userService.findAll();

		assert.deepStrictEqual(result, {
			items: [mockUser.toObject()],
		});
	});

	it("patch should update user profile", async () => {
		const updatedUser = {
			...mockUser.toObject(),
			firstName: "Jane",
			lastName: "Smith",
			passwordHash: "hash",
			passwordSalt: "salt",
		};

		const userEntity = UserEntity.initialize(updatedUser);

		const userRepository = {
			patch: (() => Promise.resolve(userEntity)) as UserRepository["patch"],
		} as UserRepository;

		const userService = new UserService(userRepository, mockGroupService);

		const result = await userService.patch(mockUser.toObject().id, {
			firstName: "Jane",
			lastName: "Smith",
		});

		assert.deepStrictEqual(result, userEntity.toObject());
	});

	it("patch should throw error when user not found", async () => {
		const userRepository = {
			patch: (() => Promise.resolve(null)) as UserRepository["patch"],
		} as UserRepository;

		const userService = new UserService(userRepository, mockGroupService);

		await assert.rejects(
			async () => {
				await userService.patch(mockUser.toObject().id, {
					firstName: "Jane",
					lastName: "Smith",
				});
			},
			(error: unknown) => {
				assert.strictEqual((error as Error).message, "User not found");

				return true;
			},
		);
	});
});
