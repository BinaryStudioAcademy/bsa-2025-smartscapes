import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { UserFollowsEntity } from "./user-follows.entity.js";

describe("UserFollowsEntity", () => {
	it("should create a new UserFollowsEntity with id", () => {
		const data = {
			followerId: 1,
			followingId: 2,
			id: 42,
		};

		const entity = UserFollowsEntity.initialize(data);
		const result = entity.toObject();

		assert.strictEqual(result.followerId, data.followerId);
		assert.strictEqual(result.followingId, data.followingId);
		assert.strictEqual(result.id, data.id);
	});

	it("should return object without id", () => {
		const data = {
			followerId: 1,
			followingId: 2,
			id: 10,
		};

		const entity = UserFollowsEntity.initialize(data);
		const result = entity.toNewObject();

		assert.strictEqual(result.followerId, data.followerId);
		assert.strictEqual(result.followingId, data.followingId);
		assert.strictEqual("id" in result, false);
	});
});
