import { type Repository } from "~/libs/types/types.js";

import { RoutesEntity } from "./routes.entity.js";
import { type RoutesModel } from "./routes.model.js";

class RoutesRepository implements Repository {
	private routesModel: typeof RoutesModel;

	public constructor(routesModel: typeof RoutesModel) {
		this.routesModel = routesModel;
	}

	public async create(entity: RoutesEntity): Promise<RoutesEntity> {
		const insertData = entity.toNewObject();

		const result = await this.routesModel
			.query()
			.insertGraph(insertData, { relate: ["pois"] })
			.returning(["id", "name", "description"]);

		return RoutesEntity.initialize(result);
	}

	public async delete(id: number): Promise<boolean> {
		const isDeleted = await this.routesModel.query().deleteById(id).execute();

		return Boolean(isDeleted);
	}

	public async findAll(): Promise<RoutesEntity[]> {
		const routes = await this.routesModel
			.query()
			.withGraphFetched("pois(selectPoiIdOrder)")
			.modifiers({
				selectPoiIdOrder(builder) {
					builder.select("points_of_interest.id", "routes_to_pois.visit_order");
				},
			})
			.select("routes.id", "routes.name", "routes.description");

		return routes.map((point) => RoutesEntity.initialize(point));
	}

	public async findById(id: number): Promise<null | RoutesEntity> {
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

		return RoutesEntity.initialize(route);
	}

	public async patch(
		id: number,
		entity: Partial<RoutesEntity["toObject"]>,
	): Promise<null | RoutesEntity> {
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

		return updatedRoute ? RoutesEntity.initialize(updatedRoute) : null;
	}
}

export { RoutesRepository };
