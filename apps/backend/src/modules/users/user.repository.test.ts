import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { UserEntity } from "./user.entity.js";
import { UserModel } from "./user.model.js";
import { UserRepository } from "./user.repository.js";

describe("UserRepository", () => {
	let userRepository: UserRepository;
	let databaseTracker: Tracker;
	const NON_EXISTENT_ID = 999;

	const mockUser: Parameters<typeof UserEntity.initialize>[0] = {
		email: "test@example.com",
		firstName: "John",
		id: 1,
		lastName: "Doe",
		passwordHash: "hash",
		passwordSalt: "salt",
	};

	beforeEach(() => {
		const database = knex({ client: MockClient });

		databaseTracker = createTracker(database);

		UserModel.knex(database);

		userRepository = new UserRepository(UserModel);
	});

	afterEach(() => {
		databaseTracker.reset();
	});

	it("create create and return new user", async () => {
		const userEntity = UserEntity.initialize(mockUser);

		databaseTracker.on.insert("users").response([userEntity]);

		const result = await userRepository.create(userEntity);

		assert.deepStrictEqual(result, userEntity);
	});

	it("findAll should return all users", async () => {
		const userEntities = [UserEntity.initialize(mockUser)];

		databaseTracker.on.select("users").response(userEntities);

		const result = await userRepository.findAll();

		assert.deepStrictEqual(result, userEntities);
	});

	it("patch should update user profile", async () => {
		const updatedUser = {
			...mockUser,
			firstName: "Jane",
			lastName: "Smith",
		};

		const userEntity = UserEntity.initialize(updatedUser);

		databaseTracker.on.update("users").response([updatedUser]);

		const result = await userRepository.patch(mockUser.id, {
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
