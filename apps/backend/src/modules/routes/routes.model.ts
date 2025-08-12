import { Model } from "objection";

import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { PointsOfInterestModel } from "../points-of-interest/points-of-interest.model.js";

class RoutesModel extends Model {
	public static readonly relationMappings = {
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
	};

	public static override get tableName(): string {
		return DatabaseTableName.ROUTES;
	}

	public description!: string;
	public id!: number;
	public name!: string;
	public pois!: {
		id: number;
		visitOrder: number;
	}[];
}

export { RoutesModel };
