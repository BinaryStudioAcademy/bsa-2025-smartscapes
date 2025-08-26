import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { UserFollowsExceptionMessage } from "~/modules/user-follows/libs/enums/enums.js";
import { UserFollowsError } from "~/modules/user-follows/libs/exceptions/user-follows.exception.js";
import { type UserFollowsRepository } from "~/modules/user-follows/user-follows.repository.js";
import { UserFollowsService } from "~/modules/user-follows/user-follows.service.js";

import { GroupEntity } from "../groups/group.entity.js";
import { GroupKey } from "../groups/libs/enums/enums.js";
import {
	NotificationEntityType,
	NotificationType,
} from "../notifications/libs/enums/enums.js";
import { type NotificationGetAllItemResponseDto } from "../notifications/libs/types/types.js";
import { type NotificationService } from "../notifications/notification.service.js";
import { PermissionEntity } from "../permission/permission.entity.js";
import { type UserService } from "../users/users.js";

const TEST_FOLLOWER_ID = 42;
const TEST_FOLLOWING_ID = 31;
const DELETED_COUNT_ONE = 1;
const DELETED_COUNT_NONE = 0;

const mockNotification: NotificationGetAllItemResponseDto = {
	content: "Test content",
	createdAt: new Date().toISOString(),
	entityId: 100,
	entityType: NotificationEntityType.USERS,
	id: 1,
	notificationType: NotificationType.USER_FOLLOWED,
	readAt: null,
	updatedAt: new Date().toISOString(),
	userId: 42,
};

const mockCreate: NotificationService["create"] = () => {
	return Promise.resolve(mockNotification);
};

const notificationService = {
	create: mockCreate,
} as NotificationService;

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

const user = {
	avatarUrl: null,
	email: "test@example.com",
	firstName: "John",
	group: mockGroup.toObject(),
	groupId: 2,
	id: 1,
	isVisibleProfile: true,
	lastName: "Doe",
};

const mockFindById: UserService["findById"] = () => {
	return Promise.resolve(user);
};

const userService = {
	findById: mockFindById,
} as UserService;

describe("UserFollowsService", () => {
	it("follow should throw error if followerId equals followingId", async () => {
		const userFollowsRepository = {
			checkIsUserFollowing: (() =>
				Promise.resolve(
					false,
				)) as UserFollowsRepository["checkIsUserFollowing"],
			followUser: (() =>
				Promise.resolve(true)) as UserFollowsRepository["followUser"],
			unfollowUser: (() =>
				Promise.resolve(
					Boolean(DELETED_COUNT_ONE),
				)) as UserFollowsRepository["unfollowUser"],
		} as UserFollowsRepository;

		const service = new UserFollowsService(
			notificationService,
			userFollowsRepository,
			userService,
		);

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
				Promise.resolve(false)) as UserFollowsRepository["followUser"],
			unfollowUser: (() =>
				Promise.resolve(
					Boolean(DELETED_COUNT_ONE),
				)) as UserFollowsRepository["unfollowUser"],
		} as UserFollowsRepository;

		const service = new UserFollowsService(
			notificationService,
			userFollowsRepository,
			userService,
		);

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
				Promise.resolve(true)) as UserFollowsRepository["followUser"],
			unfollowUser: (() =>
				Promise.resolve(
					Boolean(DELETED_COUNT_ONE),
				)) as UserFollowsRepository["unfollowUser"],
		} as UserFollowsRepository;

		const service = new UserFollowsService(
			notificationService,
			userFollowsRepository,
			userService,
		);

		await service.follow(TEST_FOLLOWER_ID, TEST_FOLLOWING_ID);
	});

	it("unfollow should throw error if followerId equals followingId", async () => {
		const userFollowsRepository = {
			checkIsUserFollowing: (() =>
				Promise.resolve(
					false,
				)) as UserFollowsRepository["checkIsUserFollowing"],
			followUser: (() =>
				Promise.resolve(false)) as UserFollowsRepository["followUser"],
			unfollowUser: (() =>
				Promise.resolve(
					Boolean(DELETED_COUNT_ONE),
				)) as UserFollowsRepository["unfollowUser"],
		} as UserFollowsRepository;

		const service = new UserFollowsService(
			notificationService,
			userFollowsRepository,
			userService,
		);

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
				Promise.resolve(false)) as UserFollowsRepository["followUser"],
			unfollowUser: (() =>
				Promise.resolve(
					Boolean(DELETED_COUNT_NONE),
				)) as UserFollowsRepository["unfollowUser"],
		} as UserFollowsRepository;

		const service = new UserFollowsService(
			notificationService,
			userFollowsRepository,
			userService,
		);

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
				Promise.resolve(true)) as UserFollowsRepository["followUser"],
			unfollowUser: (() =>
				Promise.resolve(
					Boolean(DELETED_COUNT_ONE),
				)) as UserFollowsRepository["unfollowUser"],
		} as UserFollowsRepository;

		const service = new UserFollowsService(
			notificationService,
			userFollowsRepository,
			userService,
		);

		await service.unfollow(TEST_FOLLOWER_ID, TEST_FOLLOWING_ID);
	});
});
