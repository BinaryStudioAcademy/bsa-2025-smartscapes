import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class GroupModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.GROUPS;
	}

	public key!: string;

	public name!: string;
}

export { GroupModel };
