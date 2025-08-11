import { type UserFollowsModel } from "~/modules/user-follows/user-follows.model.js";

const SELECTED_NUMBER = 1;

class UserFollowsRepository {
	private userFollowsModel: typeof UserFollowsModel;

	public constructor(userFollowsModel: typeof UserFollowsModel) {
		this.userFollowsModel = userFollowsModel;
	}

	public async checkIsUserFollowing(
		followerId: number,
		followingId: number,
	): Promise<boolean> {
		const relation = await this.userFollowsModel
			.query()
			.select(SELECTED_NUMBER)
			.where({ followerId, followingId })
			.first();

		return Boolean(relation);
	}

	public async followUser(
		followerId: number,
		followingId: number,
	): Promise<void> {
		await this.userFollowsModel.query().insert({
			followerId,
			followingId,
		});
	}

	public async unfollowUser(
		followerId: number,
		followingId: number,
	): Promise<boolean> {
		const deleteCount = await this.userFollowsModel.query().delete().where({
			followerId,
			followingId,
		});

		return Boolean(deleteCount);
	}
}

export { UserFollowsRepository };
