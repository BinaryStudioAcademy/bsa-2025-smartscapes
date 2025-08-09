import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class UserFollowsModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.USER_FOLLOWS;
	}

	public followerId!: number;

	public followingId!: number;
}

export { UserFollowsModel };
