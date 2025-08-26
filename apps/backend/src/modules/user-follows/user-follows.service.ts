import { configureString } from "~/libs/helpers/helpers.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import {
	FollowNotificationMessage,
	UserFollowsExceptionMessage,
} from "~/modules/user-follows/libs/enums/enums.js";
import { UserFollowsError } from "~/modules/user-follows/libs/exceptions/exceptions.js";
import { type UserFollowsRepository } from "~/modules/user-follows/user-follows.repository.js";

import {
	NotificationEntityType,
	NotificationType,
} from "../notifications/libs/enums/enums.js";
import { type NotificationCreateRequestDto } from "../notifications/libs/types/types.js";
import { type NotificationService } from "../notifications/notification.service.js";
import { UserExceptionMessage } from "../users/libs/enums/enums.js";
import { UserError } from "../users/libs/exceptions/exceptions.js";
import { type UserService } from "../users/users.js";

class UserFollowsService {
	private notificationService: NotificationService;

	private userFollowsRepository: UserFollowsRepository;

	private userService: UserService;

	public constructor(
		notificationService: NotificationService,
		userFollowsRepository: UserFollowsRepository,
		userService: UserService,
	) {
		this.notificationService = notificationService;
		this.userFollowsRepository = userFollowsRepository;
		this.userService = userService;
	}

	public async follow(
		followerId: number,
		followingId: number,
	): Promise<boolean> {
		if (followerId === followingId) {
			throw new UserFollowsError({
				message: UserFollowsExceptionMessage.CANNOT_FOLLOW_SELF,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		const isFollowing = await this.userFollowsRepository.checkIsUserFollowing(
			followerId,
			followingId,
		);

		if (isFollowing) {
			throw new UserFollowsError({
				message: UserFollowsExceptionMessage.ALREADY_FOLLOWING,
				status: HTTPCode.CONFLICT,
			});
		}

		const user = await this.userService.findById(followerId);

		if (!user) {
			throw new UserError({
				message: UserExceptionMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const notification: NotificationCreateRequestDto = {
			content: configureString(FollowNotificationMessage.NOTIFICATION, {
				firstName: user.firstName,
				lastName: user.lastName,
			}),
			entityId: followerId,
			entityType: NotificationEntityType.USERS,
			notificationType: NotificationType.USER_FOLLOWED,
			userId: followingId,
		};

		const isFollowed = await this.userFollowsRepository.followUser(
			followerId,
			followingId,
		);

		await this.notificationService.create(notification);

		return isFollowed;
	}

	public async unfollow(
		followerId: number,
		followingId: number,
	): Promise<boolean> {
		if (followerId === followingId) {
			throw new UserFollowsError({
				message: UserFollowsExceptionMessage.CANNOT_UNFOLLOW_SELF,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		const isDeleted = await this.userFollowsRepository.unfollowUser(
			followerId,
			followingId,
		);

		if (!isDeleted) {
			throw new UserFollowsError({
				message: UserFollowsExceptionMessage.NOT_FOLLOWING,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		return isDeleted;
	}
}

export { UserFollowsService };
