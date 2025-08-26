import { type QueryBuilder, type RelationMappings } from "objection";

import { FileFolderName } from "~/libs/enums/enums.js";
import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { FileModel } from "../files/files.model.js";
import { GroupModel } from "../groups/group.model.js";

class UserModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.USERS;
	}

	public avatar?: FileModel;

	public email!: string;

	public firstName!: string;

	public group?: GroupModel;

	public groupId!: number;

	public isVisibleProfile!: boolean;

	public lastName!: string;

	public passwordHash!: string;

	public passwordSalt!: string;

	public static relationMappings(): RelationMappings {
		return {
			avatar: {
				filter: (query: QueryBuilder<FileModel>): void => {
					query.where("folder", FileFolderName.AVATARS);
				},
				join: {
					from: "users.id",
					to: "files.entity_id",
				},
				modelClass: FileModel,
				relation: this.HasOneRelation,
			},
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
