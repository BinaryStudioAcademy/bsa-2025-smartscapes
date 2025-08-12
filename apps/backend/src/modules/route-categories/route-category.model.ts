import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class RouteCategoryModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.ROUTE_CATEGORIES;
	}

	public name!: string;
}

export { RouteCategoryModel };
