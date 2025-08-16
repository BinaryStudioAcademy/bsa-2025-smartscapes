import { type Repository } from "~/libs/types/types.js";

import { type RouteFindAllOptions } from "./libs/types/types.js";
import { RouteEntity } from "./route.entity.js";
import { type RouteModel } from "./route.model.js";

class RouteRepository implements Repository {
	private routesModel: typeof RouteModel;

	public constructor(routesModel: typeof RouteModel) {
		this.routesModel = routesModel;
	}

	public async create(entity: RouteEntity): Promise<RouteEntity> {
		const insertData = entity.toNewObject();

		const result = await this.routesModel
			.query()
			.insertGraph(insertData, { relate: ["pois"] })
			.returning(["id", "name", "description"]);

		return RouteEntity.initialize(result);
	}

	public async delete(id: number): Promise<boolean> {
		const isDeleted = await this.routesModel.query().deleteById(id).execute();

		return Boolean(isDeleted);
	}

	public async findAll(
		options: null | RouteFindAllOptions,
	): Promise<RouteEntity[]> {
		const query = this.routesModel
			.query()
			.withGraphFetched("pois")
			.modifyGraph("pois", (builder) => {
				builder.select("points_of_interest.id", "routes_to_pois.visit_order");
			})
			.select("routes.id", "routes.name", "routes.description");

		if (options?.name?.trim()) {
			query.whereILike("routes.name", `%${options.name.trim()}%`);
		}

		if (options?.categories?.length) {
			query
				.joinRelated("categories")
				.whereIn("categories.key", options.categories as string[])
				.groupBy("routes.id");
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
			.select("routes.id", "routes.name", "routes.description")
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
			.returning(["id", "name", "description"])
			.execute();

		return updatedRoute ? RouteEntity.initialize(updatedRoute) : null;
	}
}

export { RouteRepository };
