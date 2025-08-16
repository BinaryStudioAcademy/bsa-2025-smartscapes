import { Model } from "objection";

import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class CategoryModel extends AbstractModel {
	public static readonly relationMappings = {
		routes: {
			join: {
				from: "categories.id",
				through: {
					from: "route_categories.category_id",
					to: "route_categories.route_id",
				},
				to: "routes.id",
			},
			modelClass: CategoryModel,
			relation: Model.ManyToManyRelation,
		},
	};
	public static override get tableName(): string {
		return DatabaseTableName.CATEGORIES;
	}

	public key!: string;

	public name!: string;
}

export { CategoryModel };
