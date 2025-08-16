import { type Repository } from "~/libs/types/types.js";

import { CategoryEntity } from "./category.entity.js";
import { type CategoryModel } from "./category.model.js";

class CategoryRepository implements Repository {
	private categoryModel: typeof CategoryModel;

	public constructor(categoryModel: typeof CategoryModel) {
		this.categoryModel = categoryModel;
	}

	public async create(entity: CategoryEntity): Promise<CategoryEntity> {
		const { key, name } = entity.toNewObject();

		const routeCategory = await this.categoryModel
			.query()
			.insert({ key, name })
			.returning("*")
			.execute();

		return CategoryEntity.initialize(routeCategory);
	}

	public async findAll(): Promise<CategoryEntity[]> {
		const routeCategories = await this.categoryModel.query().execute();

		return routeCategories.map((routeCategory) =>
			CategoryEntity.initialize(routeCategory),
		);
	}

	public async findByName(name: string): Promise<CategoryEntity | null> {
		const routeCategory = await this.categoryModel
			.query()
			.whereRaw("LOWER(name) LIKE ?", [`%${name.toLowerCase()}%`])
			.first()
			.execute();

		return routeCategory ? CategoryEntity.initialize(routeCategory) : null;
	}
}

export { CategoryRepository };
