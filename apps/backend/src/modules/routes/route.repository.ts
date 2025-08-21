import { SortingOrder } from "~/libs/enums/enums.js";
import {
	type Repository,
	type TransactionOptions,
} from "~/libs/types/types.js";

import { type PlannedPathModel } from "../planned-paths/planned-path.model.js";
import { type RouteFindAllOptions } from "./libs/types/types.js";
import { RouteEntity } from "./route.entity.js";
import { type RouteModel } from "./route.model.js";

class RouteRepository implements Repository {
	private plannedPathModel: typeof PlannedPathModel;
	private routesModel: typeof RouteModel;

	public constructor(
		routesModel: typeof RouteModel,
		plannedPathModel: typeof PlannedPathModel,
	) {
		this.plannedPathModel = plannedPathModel;
		this.routesModel = routesModel;
	}

	public async create(
		entity: RouteEntity,
		options?: TransactionOptions,
	): Promise<RouteEntity> {
		const insertData = entity.toNewObject();

		let query = this.routesModel.query();

		if (options?.transaction) {
			query = query.transacting(options.transaction);
		}

		const result = await query
			.insertGraph(insertData, { relate: ["pois"] })
			.returning([
				"id",
				"name",
				"description",
				this.routesModel.raw("to_json(distance)::json as distance"),
				this.routesModel.raw("to_json(duration)::json as duration"),
				this.routesModel.raw("ST_AsGeoJSON(geometry)::json as geometry"),
				"created_by_user_id",
			]);

		return RouteEntity.initialize(result);
	}

	public async delete(id: number): Promise<boolean> {
		const isDeleted = await this.routesModel.query().deleteById(id).execute();

		return Boolean(isDeleted);
	}

	public async findAll(
		options: null | RouteFindAllOptions,
	): Promise<RouteEntity[]> {
		const { categories, latitude, longitude, name } = options ?? {};

		const query = this.routesModel
			.query()
			.withGraphFetched("pois")
			.modifyGraph("pois", (builder) => {
				builder.select("points_of_interest.id", "routes_to_pois.visit_order");
			})
			.select([
				"routes.id",
				"routes.name",
				"routes.description",
				this.routesModel.raw("to_json(distance)::json as distance"),
				this.routesModel.raw("to_json(duration)::json as duration"),
				this.routesModel.raw("ST_AsGeoJSON(routes.geometry)::json as geometry"),
				"routes.created_by_user_id",
			]);

		let requiresGroupBy = false;

		if (name) {
			query.whereILike("routes.name", `%${name.trim()}%`);
		}

		if (categories?.length) {
			query
				.joinRelated("categories")
				.whereIn("categories.key", categories as string[]);
			requiresGroupBy = true;
		}

		if (latitude !== undefined && longitude !== undefined) {
			query
				.joinRelated("pois")
				.where("pois_join.visit_order", 0)
				.select(
					this.routesModel.raw(
						`MIN(ST_Distance(
							pois.location::geography,
							ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography
						)) as distance_points`,
						[longitude, latitude],
					),
				)
				.orderBy("distance_points", SortingOrder.ASC);
			requiresGroupBy = true;
		}

		if (requiresGroupBy) {
			query.groupBy("routes.id");
		}

		const routes = await query;

		return routes.map((route) => RouteEntity.initializeList(route));
	}

	public async findById(id: number): Promise<null | RouteEntity> {
		const route = await this.routesModel
			.query()
			.withGraphFetched("pois(selectPoiIdOrder)")
			.modifiers({
				selectPoiIdOrder(builder) {
					builder.select("points_of_interest.id", "routes_to_pois.visit_order");
				},
			})
			.select([
				"routes.id",
				"routes.name",
				"routes.description",
				this.routesModel.raw("to_json(distance)::json as distance"),
				this.routesModel.raw("to_json(duration)::json as duration"),
				this.routesModel.raw("ST_AsGeoJSON(routes.geometry)::json as geometry"),
				"routes.created_by_user_id",
			])
			.where("routes.id", id)
			.first();

		if (!route) {
			return null;
		}

		return RouteEntity.initialize(route);
	}

	public async patch(
		id: number,
		entity: Partial<RouteEntity["toObject"]>,
	): Promise<null | RouteEntity> {
		const [updatedRoute] = await this.routesModel
			.query()
			.patch(entity)
			.withGraphFetched("pois(selectPoiIdOrder)")
			.modifiers({
				selectPoiIdOrder(builder) {
					builder.select("points_of_interest.id", "routes_to_pois.visit_order");
				},
			})
			.where({ id })
			.returning([
				"id",
				"name",
				"description",
				this.routesModel.raw("to_json(distance)::json as distance"),
				this.routesModel.raw("to_json(duration)::json as duration"),
				this.routesModel.raw("ST_AsGeoJSON(routes.geometry)::json as geometry"),
				"routes.created_by_user_id",
			])
			.execute();

		return updatedRoute ? RouteEntity.initialize(updatedRoute) : null;
	}
}

export { RouteRepository };
