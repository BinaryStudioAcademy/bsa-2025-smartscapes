import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { UserFollowsModel } from "~/modules/user-follows/user-follows.model.js";

import { UserFollowsRepository } from "./user-follows.repository.js";

describe("UserFollowsRepository", () => {
	let userFollowsRepository: UserFollowsRepository;
	let databaseTracker: Tracker;

	const TEST_FOLLOWER_ID = 1;
	const TEST_FOLLOWING_ID = 2;
	const DELETED_COUNT_ONE = 1;
	const DELETED_COUNT_NONE = 0;

	beforeEach(() => {
		const database = knex({ client: MockClient });

		databaseTracker = createTracker(database);

		UserFollowsModel.knex(database);

		userFollowsRepository = new UserFollowsRepository(UserFollowsModel);
	});

	afterEach(() => {
		databaseTracker.reset();
	});

	it("checkIsUserFollowing should return true if relation exists", async () => {
		databaseTracker.on
			.select("user_follows")
			.response([
				{ followerId: TEST_FOLLOWER_ID, followingId: TEST_FOLLOWING_ID },
			]);

		const result = await userFollowsRepository.checkIsUserFollowing(
			TEST_FOLLOWER_ID,
			TEST_FOLLOWING_ID,
		);
		assert.strictEqual(result, true);
	});

	it("checkIsUserFollowing should return false if relation does not exist", async () => {
		databaseTracker.on.select("user_follows").response([]);

		const result = await userFollowsRepository.checkIsUserFollowing(
			TEST_FOLLOWER_ID,
			TEST_FOLLOWING_ID,
		);
		assert.strictEqual(result, false);
	});

	it("followUser should insert a new follow relation", async () => {
		databaseTracker.on
			.insert("user_follows")
			.response([
				{ followerId: TEST_FOLLOWER_ID, followingId: TEST_FOLLOWING_ID },
			]);

		await userFollowsRepository.followUser(TEST_FOLLOWER_ID, TEST_FOLLOWING_ID);
	});

	it("unfollowUser should delete follow relation and return true", async () => {
		databaseTracker.on.delete("user_follows").response(DELETED_COUNT_ONE);

		const isDeleted = Boolean(
			await userFollowsRepository.unfollowUser(
				TEST_FOLLOWER_ID,
				TEST_FOLLOWING_ID,
			),
		);
		assert.strictEqual(isDeleted, true);
	});

	it("unfollowUser should return false if no rows deleted", async () => {
		databaseTracker.on.delete("user_follows").response(DELETED_COUNT_NONE);

		const isDelete = Boolean(
			await userFollowsRepository.unfollowUser(
				TEST_FOLLOWER_ID,
				TEST_FOLLOWING_ID,
			),
		);
		assert.strictEqual(isDelete, false);
	});
});
