import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { GroupEntity } from "../groups/group.entity.js";
import { UserEntity } from "./user.entity.js";
import { UserModel } from "./user.model.js";
import { UserRepository } from "./user.repository.js";

describe("UserRepository", () => {
	let userRepository: UserRepository;
	let databaseTracker: Tracker;

	const mockGroup = GroupEntity.initialize({
		id: 2,
		key: "users",
		name: "Users",
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

		databaseTracker.on.insert("users").response([userEntity]);

		const result = await userRepository.create(userEntity);

		assert.deepStrictEqual(result, userEntity);
	});
	it("findAll should return all users", async () => {
		const userEntities = [mockUser];

		databaseTracker.on.select("users").response(userEntities);

		const result = await userRepository.findAll();

		assert.deepStrictEqual(result, userEntities);
	});
});
