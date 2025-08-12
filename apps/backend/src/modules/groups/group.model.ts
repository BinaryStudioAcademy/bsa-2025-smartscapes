import { Model } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { type ValueOf } from "~/libs/types/types.js";

import { PermissionModel } from "../permission/permission.model.js";
import { type GroupKey } from "./libs/enums/enums.js";

class GroupModel extends AbstractModel {
	public static readonly relationMappings = {
		permissions: {
			join: {
				from: "groups.id",
				through: {
					from: "groups_to_permissions.group_id",
					to: "groups_to_permissions.permission_id",
				},
				to: "permissions.id",
			},
			modelClass: PermissionModel,
			relation: Model.ManyToManyRelation,
		},
	};

	public static override get tableName(): string {
		return DatabaseTableName.GROUPS;
	}

	public key!: ValueOf<typeof GroupKey>;

	public name!: string;

	public permissions?: PermissionModel[];
}

export { GroupModel };
