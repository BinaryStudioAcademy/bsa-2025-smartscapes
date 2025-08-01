import { Model, type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class UserModel extends AbstractModel {
	public static get relationMappings(): RelationMappings {
		return {
			followers: {
				join: {
					from: "users.id",
					through: {
						from: "user_follows.following_id",
						to: "user_follows.follower_id",
					},
					to: "users.id",
				},
				modelClass: UserModel,
				relation: Model.ManyToManyRelation,
			},
			following: {
				join: {
					from: "users.id",
					through: {
						from: "user_follows.follower_id",
						to: "user_follows.following_id",
					},
					to: "users.id",
				},
				modelClass: UserModel,
				relation: Model.ManyToManyRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.USERS;
	}

	public email!: string;

	public firstName!: string;

	public lastName!: string;

	public passwordHash!: string;

	public passwordSalt!: string;
}

export { UserModel };
