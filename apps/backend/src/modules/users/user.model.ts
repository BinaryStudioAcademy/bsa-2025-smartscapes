import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class UserModel extends AbstractModel {
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
