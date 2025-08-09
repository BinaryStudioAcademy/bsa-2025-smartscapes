import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { UserFollowsExceptionMessage } from "~/modules/user-follows/libs/enums/enums.js";
import { UserFollowsError } from "~/modules/user-follows/libs/exceptions/user-follows.exception.js";
import { type UserFollowsRepository } from "~/modules/user-follows/user-follows.repository.js";
import { UserFollowsService } from "~/modules/user-follows/user-follows.service.js";

const TEST_FOLLOWER_ID = 42;
const TEST_FOLLOWING_ID = 31;
const DELETED_COUNT_ONE = 1;
const DELETED_COUNT_NONE = 0;

describe("UserFollowsService", () => {
	it("follow should throw error if followerId equals followingId", async () => {
		const userFollowsRepository = {
			checkIsUserFollowing: (() =>
				Promise.resolve(
					false,
				)) as UserFollowsRepository["checkIsUserFollowing"],
			followUser: (() =>
				Promise.resolve()) as UserFollowsRepository["followUser"],
			unfollowUser: (() =>
				Promise.resolve(
					Boolean(DELETED_COUNT_ONE),
				)) as UserFollowsRepository["unfollowUser"],
		} as UserFollowsRepository;

		const service = new UserFollowsService(userFollowsRepository);

		try {
			await service.follow(TEST_FOLLOWER_ID, TEST_FOLLOWER_ID);
			assert.fail("Expected UserFollowsError was not thrown");
		} catch (error) {
			assert.ok(error instanceof UserFollowsError);
			assert.equal(
				error.message,
				UserFollowsExceptionMessage.CANNOT_FOLLOW_SELF,
			);
			assert.equal(error.status, HTTPCode.BAD_REQUEST);
		}
	});

	it("follow should throw error if already following", async () => {
		const userFollowsRepository = {
			checkIsUserFollowing: (() =>
				Promise.resolve(true)) as UserFollowsRepository["checkIsUserFollowing"],
			followUser: (() =>
				Promise.resolve()) as UserFollowsRepository["followUser"],
			unfollowUser: (() =>
				Promise.resolve(
					Boolean(DELETED_COUNT_ONE),
				)) as UserFollowsRepository["unfollowUser"],
		} as UserFollowsRepository;

		const service = new UserFollowsService(userFollowsRepository);

		try {
			await service.follow(TEST_FOLLOWER_ID, TEST_FOLLOWING_ID);
			assert.fail("Expected UserFollowsError was not thrown");
		} catch (error) {
			assert.ok(error instanceof UserFollowsError);
			assert.equal(
				error.message,
				UserFollowsExceptionMessage.ALREADY_FOLLOWING,
			);
			assert.equal(error.status, HTTPCode.CONFLICT);
		}
	});

	it("follow should succeed if not already following", async () => {
		const userFollowsRepository = {
			checkIsUserFollowing: (() =>
				Promise.resolve(
					false,
				)) as UserFollowsRepository["checkIsUserFollowing"],
			followUser: (() =>
				Promise.resolve()) as UserFollowsRepository["followUser"],
			unfollowUser: (() =>
				Promise.resolve(
					Boolean(DELETED_COUNT_ONE),
				)) as UserFollowsRepository["unfollowUser"],
		} as UserFollowsRepository;

		const service = new UserFollowsService(userFollowsRepository);

		await service.follow(TEST_FOLLOWER_ID, TEST_FOLLOWING_ID);
	});

	it("unfollow should throw error if followerId equals followingId", async () => {
		const userFollowsRepository = {
			checkIsUserFollowing: (() =>
				Promise.resolve(
					false,
				)) as UserFollowsRepository["checkIsUserFollowing"],
			followUser: (() =>
				Promise.resolve()) as UserFollowsRepository["followUser"],
			unfollowUser: (() =>
				Promise.resolve(
					Boolean(DELETED_COUNT_ONE),
				)) as UserFollowsRepository["unfollowUser"],
		} as UserFollowsRepository;

		const service = new UserFollowsService(userFollowsRepository);

		try {
			await service.unfollow(TEST_FOLLOWER_ID, TEST_FOLLOWER_ID);
			assert.fail("Expected UserFollowsError was not thrown");
		} catch (error) {
			assert.ok(error instanceof UserFollowsError);
			assert.equal(
				error.message,
				UserFollowsExceptionMessage.CANNOT_UNFOLLOW_SELF,
			);
			assert.equal(error.status, HTTPCode.BAD_REQUEST);
		}
	});

	it("unfollow should throw error if not following", async () => {
		const userFollowsRepository = {
			checkIsUserFollowing: (() =>
				Promise.resolve(
					false,
				)) as UserFollowsRepository["checkIsUserFollowing"],
			followUser: (() =>
				Promise.resolve()) as UserFollowsRepository["followUser"],
			unfollowUser: (() =>
				Promise.resolve(
					Boolean(DELETED_COUNT_NONE),
				)) as UserFollowsRepository["unfollowUser"],
		} as UserFollowsRepository;

		const service = new UserFollowsService(userFollowsRepository);

		try {
			await service.unfollow(TEST_FOLLOWER_ID, TEST_FOLLOWING_ID);
			assert.fail("Expected UserFollowsError was not thrown");
		} catch (error) {
			assert.ok(error instanceof UserFollowsError);
			assert.equal(error.message, UserFollowsExceptionMessage.NOT_FOLLOWING);
			assert.equal(error.status, HTTPCode.BAD_REQUEST);
		}
	});

	it("unfollow should succeed if following", async () => {
		const userFollowsRepository = {
			checkIsUserFollowing: (() =>
				Promise.resolve(true)) as UserFollowsRepository["checkIsUserFollowing"],
			followUser: (() =>
				Promise.resolve()) as UserFollowsRepository["followUser"],
			unfollowUser: (() =>
				Promise.resolve(
					Boolean(DELETED_COUNT_ONE),
				)) as UserFollowsRepository["unfollowUser"],
		} as UserFollowsRepository;

		const service = new UserFollowsService(userFollowsRepository);

		await service.unfollow(TEST_FOLLOWER_ID, TEST_FOLLOWING_ID);
	});
});
