import { type Repository } from "~/libs/types/types.js";

import { RouteCategoryEntity } from "./route-category.entity.js";
import { type RouteCategoryModel } from "./route-category.model.js";

class RouteCategoryRepository implements Repository {
	private routeCategoryModel: typeof RouteCategoryModel;

	public constructor(routeCategoryModel: typeof RouteCategoryModel) {
		this.routeCategoryModel = routeCategoryModel;
	}

	public async create(
		entity: RouteCategoryEntity,
	): Promise<RouteCategoryEntity> {
		const { name } = entity.toNewObject();

		const routeCategory = await this.routeCategoryModel
			.query()
			.insert({ name })
			.returning("*")
			.execute();

		return RouteCategoryEntity.initialize(routeCategory);
	}

	public async findAll(): Promise<RouteCategoryEntity[]> {
		const routeCategories = await this.routeCategoryModel.query().execute();

		return routeCategories.map((routeCategory) =>
			RouteCategoryEntity.initialize(routeCategory),
		);
	}

	public async findByName(name: string): Promise<null | RouteCategoryEntity> {
		const routeCategory = await this.routeCategoryModel
			.query()
			.whereRaw("LOWER(name) LIKE ?", [`%${name.toLowerCase()}%`])
			.first()
			.execute();

		return routeCategory ? RouteCategoryEntity.initialize(routeCategory) : null;
	}
}

export { RouteCategoryRepository };
