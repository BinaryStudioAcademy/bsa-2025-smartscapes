import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { UserFollowsExceptionMessage } from "~/modules/user-follows/libs/enums/enums.js";
import { UserFollowsError } from "~/modules/user-follows/libs/exceptions/user-follows.exception.js";
import { type UserFollowsService } from "~/modules/user-follows/user-follows.service.js";

import { UserFollowsController } from "./user-follows.controller.js";

const createMockFollowServiceMethod = (
	expectedFollowerId: number,
	expectedFollowingId: number,
) => {
	return (followerId: number, followingId: number): Promise<void> => {
		assert.strictEqual(followerId, expectedFollowerId);
		assert.strictEqual(followingId, expectedFollowingId);

		return Promise.resolve();
	};
};

describe("UserFollowsController", () => {
	const mockLogger: Logger = {
		debug: () => {},
		error: () => {},
		info: () => {},
		warn: () => {},
	};

	const TEST_FOLLOWER_ID = 42;
	const TEST_FOLLOWING_ID = 31;

	const mockAuthenticatedUser = {
		email: "test@example.com",
		firstName: "John",
		id: TEST_FOLLOWER_ID,
		lastName: "Doe",
	};

	const mockAnotherUser = {
		email: "another@example.com",
		firstName: "Alice",
		id: TEST_FOLLOWING_ID,
		lastName: "Smith",
	};

	const mockFollow: UserFollowsService["follow"] =
		createMockFollowServiceMethod(TEST_FOLLOWER_ID, TEST_FOLLOWING_ID);

	const mockUnfollow: UserFollowsService["unfollow"] =
		createMockFollowServiceMethod(TEST_FOLLOWER_ID, TEST_FOLLOWING_ID);

	it("Follow should return 200 OK when userId matches followerId", async () => {
		const userFollowsService = {
			follow: mockFollow,
		} as UserFollowsService;

		const controller = new UserFollowsController(
			mockLogger,
			userFollowsService,
		);

		const request = {
			body: { followingId: TEST_FOLLOWING_ID },
			params: { userId: String(TEST_FOLLOWER_ID) },
			query: null,
			user: mockAuthenticatedUser,
		};

		const result = await controller.follow(request);

		assert.deepStrictEqual(result, {
			payload: null,
			status: HTTPCode.OK,
		});
	});

	it("Follow should return 401 UNAUTHORIZED when userId does not match followerId", async () => {
		const userFollowsService = {
			follow: () => Promise.resolve(),
		} as unknown as UserFollowsService;

		const controller = new UserFollowsController(
			mockLogger,
			userFollowsService,
		);

		const request = {
			body: { followingId: TEST_FOLLOWING_ID },
			params: { userId: String(TEST_FOLLOWER_ID) },
			query: null,
			user: mockAnotherUser,
		};

		try {
			await controller.follow(request);
			assert.fail("Expected UserFollowsError was not thrown");
		} catch (error) {
			assert.ok(error instanceof UserFollowsError);
			assert.equal(
				error.message,
				UserFollowsExceptionMessage.UNAUTHORIZED_USER,
			);
			assert.equal(error.status, HTTPCode.UNAUTHORIZED);
		}
	});

	it("Unfollow should return 200 OK when userId matches followerId", async () => {
		const userFollowsService = {
			unfollow: mockUnfollow,
		} as UserFollowsService;

		const controller = new UserFollowsController(
			mockLogger,
			userFollowsService,
		);

		const request = {
			body: null,
			params: {
				id: String(TEST_FOLLOWING_ID),
				userId: String(TEST_FOLLOWER_ID),
			},
			query: null,
			user: mockAuthenticatedUser,
		};

		const result = await controller.unfollow(request);

		assert.deepStrictEqual(result, {
			payload: null,
			status: HTTPCode.OK,
		});
	});

	it("Unfollow should return 401 UNAUTHORIZED when userId does not match followerId", async () => {
		const userFollowsService = {
			unfollow: () => Promise.resolve(),
		} as unknown as UserFollowsService;

		const controller = new UserFollowsController(
			mockLogger,
			userFollowsService,
		);

		const request = {
			body: null,
			params: {
				id: String(TEST_FOLLOWING_ID),
				userId: String(TEST_FOLLOWER_ID),
			},
			query: null,
			user: mockAnotherUser,
		};

		try {
			await controller.unfollow(request);
			assert.fail("Expected UserFollowsError was not thrown");
		} catch (error) {
			assert.ok(error instanceof UserFollowsError);
			assert.equal(
				error.message,
				UserFollowsExceptionMessage.UNAUTHORIZED_USER,
			);
			assert.equal(error.status, HTTPCode.UNAUTHORIZED);
		}
	});
});
