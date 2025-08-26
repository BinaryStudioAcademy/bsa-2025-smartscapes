import { type RouteUploadImageResponseDto } from "@smartscapes/shared";
import { Model, type QueryBuilder, type RelationMappings } from "objection";

import { FileFolderName } from "~/libs/enums/enums.js";
import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { type LineStringGeometry } from "~/libs/types/types.js";

import { CategoryModel } from "../categories/category.model.js";
import { FileModel } from "../files/files.model.js";
import { PointsOfInterestModel } from "../points-of-interest/points-of-interest.model.js";

class RouteModel extends Model {
	public static override get tableName(): string {
		return DatabaseTableName.ROUTES;
	}

	public createdByUserId!: number;

	public description!: string;

	public distance!: number;

	public duration!: number;

	public geometry!: LineStringGeometry;

	public id!: number;

	public images!: RouteUploadImageResponseDto[];

	public name!: string;

	public pois!: {
		id: number;
		name: string;
		visitOrder: number;
	}[];

	public static readonly relationMappings = (): RelationMappings => ({
		categories: {
			join: {
				from: "routes.id",
				through: {
					from: "route_categories.route_id",
					to: "route_categories.category_id",
				},
				to: "categories.id",
			},
			modelClass: CategoryModel,
			relation: Model.ManyToManyRelation,
		},
		images: {
			filter: (query: QueryBuilder<FileModel>): void => {
				query.where("folder", FileFolderName.ROUTES);
			},
			join: {
				from: "routes.id",
				to: "files.entityId",
			},
			modelClass: FileModel,
			relation: this.HasManyRelation,
		},
		pois: {
			join: {
				from: "routes.id",
				through: {
					extra: ["visitOrder"],
					from: "routes_to_pois.route_id",
					to: "routes_to_pois.poi_id",
				},
				to: "points_of_interest.id",
			},
			modelClass: PointsOfInterestModel,
			relation: Model.ManyToManyRelation,
		},
	});
}

export { RouteModel };
