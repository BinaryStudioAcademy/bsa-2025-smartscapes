import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { UserEntity } from "./user.entity.js";

describe("UserEntity", () => {
	it("should create new user entity", () => {
		const userData = {
			email: "test@example.com",
			firstName: "John",
			group: null,
			groupId: 2,
			id: 1,
			lastName: "Doe",
			passwordHash: "hash",
			passwordSalt: "salt",
		};

		const userEntity = UserEntity.initialize(userData);
		const result = userEntity.toObject();

		assert.strictEqual(result.email, userData.email);
		assert.strictEqual(result.id, userData.id);
	});

	it("should initialize new user without id", () => {
		const userData = {
			email: "test@example.com",
			firstName: "John",
			group: null,
			groupId: 2,
			lastName: "Doe",
			passwordHash: "hash",
			passwordSalt: "salt",
		};

		const userEntity = UserEntity.initializeNew(userData);
		const result = userEntity.toNewObject();

		assert.strictEqual(result.email, userData.email);
		assert.strictEqual(result.passwordHash, userData.passwordHash);
	});
});
