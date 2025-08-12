import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { GroupEntity } from "../groups/group.entity.js";
import { PermissionEntity } from "../permission/permission.entity.js";
import { UserEntity } from "./user.entity.js";
import { UserModel } from "./user.model.js";
import { UserRepository } from "./user.repository.js";

describe("UserRepository", () => {
	let userRepository: UserRepository;
	let databaseTracker: Tracker;
	const NON_EXISTENT_ID = 999;

	const mockPermission = PermissionEntity.initialize({
		id: 1,
		key: "READ",
		name: "Can read",
	});

	const mockGroup = GroupEntity.initializeWithPermissions({
		id: 2,
		key: "users",
		name: "Users",
		permissions: [mockPermission.toObject()],
	}).toObject();

	const mockUser = UserEntity.initialize({
		email: "test@example.com",
		firstName: "John",
		group: mockGroup,
		groupId: 2,
		id: 1,
		lastName: "Doe",
		passwordHash: "hash",
		passwordSalt: "salt",
	});

	beforeEach(() => {
		const database = knex({ client: MockClient, dialect: "pg" });
		databaseTracker = createTracker(database);
		databaseTracker.on.any("information_schema").response([]);
		UserModel.knex(database);
		userRepository = new UserRepository(UserModel);
	});

	afterEach(() => {
		databaseTracker.reset();
	});

	it("create should insert and return new user", async () => {
		const userEntity = UserEntity.initialize({
			email: "test@example.com",
			firstName: "John",
			group: mockGroup,
			groupId: 2,
			id: 1,
			lastName: "Doe",
			passwordHash: "hash",
			passwordSalt: "salt",
		});

		databaseTracker.on.insert("users").response([userEntity]);

		databaseTracker.on.select("users").response([
			{
				...userEntity.toObject(),
				"group:id": 2,
				"group:key": "users",
				"group:name": "Users",
				"group:permissions:id": 1,
				"group:permissions:key": "READ",
				"group:permissions:name": "Can read",
				passwordHash: "hash",
				passwordSalt: "salt",
			},
		]);

		const result = await userRepository.create(userEntity);

		assert.deepStrictEqual(result, userEntity);
	});

	it("findAll should return all users", async () => {
		const userData = {
			...mockUser.toObject(),
			"group:id": 2,
			"group:key": "users",
			"group:name": "Users",
			"group:permissions:id": 1,
			"group:permissions:key": "READ",
			"group:permissions:name": "Can read",
			passwordHash: "hash",
			passwordSalt: "salt",
		};

		databaseTracker.on.select("users").response([userData]);

		const testUser = UserEntity.initialize(userData);

		const result = await userRepository.findAll();

		assert.deepStrictEqual(result, [testUser]);
	});

	it("patch should update user profile", async () => {
		const updatedUser = {
			...mockUser.toObject(),
			"group:id": 2,
			"group:key": "users",
			"group:name": "Users",
			"group:permissions:id": 1,
			"group:permissions:key": "READ",
			"group:permissions:name": "Can read",
			passwordHash: "hash",
			passwordSalt: "salt",
		};

		const userEntity = UserEntity.initialize(updatedUser);

		databaseTracker.on.update("users").response([updatedUser]);

		databaseTracker.on.select("users").response([updatedUser]);

		const result = await userRepository.patch(mockUser.toObject().id, {
			firstName: "Jane",
			lastName: "Smith",
		});

		assert.deepStrictEqual(result, userEntity);
	});

	it("patch should return null when user not found", async () => {
		databaseTracker.on.update("users").response([]);

		const result = await userRepository.patch(NON_EXISTENT_ID, {
			firstName: "Jane",
			lastName: "Smith",
		});

		assert.strictEqual(result, null);
	});
});
