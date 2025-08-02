import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { type Repository } from "~/libs/types/types.js";

import { RouteEntity } from "./routes.entity.js";
import { type RoutesModel } from "./routes.model.js";

class RoutesRepository implements Repository {
	private routesModel: typeof RoutesModel;

	public constructor(routesModel: typeof RoutesModel) {
		this.routesModel = routesModel;
	}

	public async create(entity: RouteEntity): Promise<RouteEntity> {
		const { description, name, pois } = entity.toNewObject();

		const route = await this.routesModel
			.query()
			.insert({ description, name })
			.returning("*")
			.execute();

		await this.insertRoutePois(route.id, pois);

		const routePois = await this.getRoutePois(route.id);

		return RouteEntity.initialize({
			description: route.description,
			id: route.id,
			name: route.name,
			pois: routePois,
		});
	}

	public async delete(id: number): Promise<boolean> {
		await this.deleteRoutePois(id);

		const isDeleted = await this.routesModel.query().deleteById(id).execute();

		return Boolean(isDeleted);
	}

	public async findAll(): Promise<RouteEntity[]> {
		const routes = await this.routesModel.query().execute();

		const routesWithPois = await Promise.all(
			routes.map(async (route) => {
				const pois = await this.getRoutePois(route.id);

				return RouteEntity.initialize({
					description: route.description,
					id: route.id,
					name: route.name,
					pois,
				});
			}),
		);

		return routesWithPois;
	}

	public async findById(id: number): Promise<null | RouteEntity> {
		const route = await this.routesModel.query().findById(id).execute();

		if (!route) {
			return null;
		}

		const pois = await this.getRoutePois(id);

		return RouteEntity.initialize({
			description: route.description,
			id: route.id,
			name: route.name,
			pois,
		});
	}

	public async patch(
		id: number,
		entity: {
			description?: string;
			name?: string;
			pois?: {
				id: number;
				visitOrder: number;
			}[];
		},
	): Promise<RouteEntity> {
		const { description, name, pois } = entity;

		if (description !== undefined || name !== undefined) {
			const patchData = Object.fromEntries(
				Object.entries({ description, name }).filter(
					([, value]) => value !== undefined,
				),
			);

			await this.routesModel.query().patchAndFetchById(id, patchData).execute();
		}

		if (pois !== undefined) {
			await this.deleteRoutePois(id);
			await this.insertRoutePois(id, pois);
		}

		return await (this.findById(id) as Promise<RouteEntity>);
	}

	private async deleteRoutePois(routeId: number): Promise<void> {
		await this.routesModel
			.knex()
			.table(DatabaseTableName.ROUTES_TO_POIS)
			.where("route_id", routeId)
			.del();
	}

	private async getRoutePois(
		routeId: number,
	): Promise<Array<{ id: number; visitOrder: number }>> {
		const results = await this.routesModel
			.knex()
			.select("poi_id as id", "visit_order as visitOrder")
			.from(DatabaseTableName.ROUTES_TO_POIS)
			.where("route_id", routeId)
			.orderBy("visit_order", "asc");

		return results.map((row: { id: number; visitOrder: number }) => ({
			id: row.id,
			visitOrder: row.visitOrder,
		}));
	}

	private async insertRoutePois(
		routeId: number,
		pois: Array<{ id: number; visitOrder: number }>,
	): Promise<void> {
		const joinRows = pois.map((poi) => ({
			poi_id: poi.id,
			route_id: routeId,
			visit_order: poi.visitOrder,
		}));

		await this.routesModel
			.knex()
			.insert(joinRows)
			.into(DatabaseTableName.ROUTES_TO_POIS);
	}
}

export { RoutesRepository };
