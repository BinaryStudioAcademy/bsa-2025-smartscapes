import { HTTPCode } from "~/libs/modules/http/http.js";
import { UserFollowsExceptionMessage } from "~/modules/user-follows/libs/enums/enums.js";
import { UserFollowsError } from "~/modules/user-follows/libs/exceptions/exceptions.js";
import { type UserFollowsRepository } from "~/modules/user-follows/user-follows.repository.js";

class UserFollowsService {
	private userFollowsRepository: UserFollowsRepository;

	public constructor(userFollowsRepository: UserFollowsRepository) {
		this.userFollowsRepository = userFollowsRepository;
	}

	public async follow(followerId: number, followingId: number): Promise<void> {
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

		await this.userFollowsRepository.followUser(followerId, followingId);
	}

	public async unfollow(
		followerId: number,
		followingId: number,
	): Promise<void> {
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
	}
}

export { UserFollowsService };
