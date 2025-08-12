import { type RelationMappings } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { GroupModel } from "../groups/group.model.js";

class UserModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.USERS;
	}

	public email!: string;

	public firstName!: string;

	public group?: GroupModel;

	public groupId!: number;

	public lastName!: string;

	public passwordHash!: string;

	public passwordSalt!: string;

	public static relationMappings(): RelationMappings {
		return {
			group: {
				join: {
					from: `${DatabaseTableName.USERS}.group_id`,
					to: `${DatabaseTableName.GROUPS}.id`,
				},
				modelClass: GroupModel,
				relation: this.BelongsToOneRelation,
			},
		};
	}
}

export { UserModel };
