import { type Entity } from "~/libs/types/types.js";

class UserFollowsEntity implements Entity {
	private followerId: number;
	private followingId: number;
	private id: null | number;

	private constructor({
		followerId,
		followingId,
		id,
	}: {
		followerId: number;
		followingId: number;
		id: number;
	}) {
		this.id = id;
		this.followerId = followerId;
		this.followingId = followingId;
	}

	public static initialize({
		followerId,
		followingId,
		id,
	}: {
		followerId: number;
		followingId: number;
		id: number;
	}): UserFollowsEntity {
		return new UserFollowsEntity({ followerId, followingId, id });
	}

	public toNewObject(): { followerId: number; followingId: number } {
		return {
			followerId: this.followerId,
			followingId: this.followingId,
		};
	}

	public toObject(): { followerId: number; followingId: number; id: number } {
		return {
			followerId: this.followerId,
			followingId: this.followingId,
			id: this.id as number,
		};
	}
}

export { UserFollowsEntity };
