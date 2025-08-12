import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class PermissionModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.PERMISSIONS;
	}

	public key!: string;

	public name!: string;
}

export { PermissionModel };
