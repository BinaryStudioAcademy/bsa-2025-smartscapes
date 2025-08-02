import { Model } from "objection";

import { DatabaseTableName } from "~/libs/modules/database/database.js";

class RoutesModel extends Model {
	public static override get tableName(): string {
		return DatabaseTableName.ROUTES;
	}

	public description!: string;
	public id!: number;
	public name!: string;
}

export { RoutesModel };
