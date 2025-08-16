import { HTTPCode } from "~/libs/modules/http/http.js";
import { type CollectionResult, type Service } from "~/libs/types/types.js";

import { CategoryEntity } from "./category.entity.js";
import { type CategoryRepository } from "./category.repository.js";
import { CategoryExceptionMessage } from "./libs/enums/enums.js";
import { RouteCategoryError } from "./libs/exceptions/exceptions.js";
import {
	type CategoryCreateRequestDto,
	type CategoryGetAllItemResponseDto,
} from "./libs/types/types.js";

class CategoryService implements Service {
	private categoryRepository: CategoryRepository;

	public constructor(categoryRepository: CategoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	public async create(
		payload: CategoryCreateRequestDto,
	): Promise<CategoryGetAllItemResponseDto> {
		const { key, name } = payload;

		const existingRouteCategory =
			await this.categoryRepository.findByName(name);

		if (existingRouteCategory) {
			throw new RouteCategoryError({
				message: CategoryExceptionMessage.ALREADY_EXISTS,
				status: HTTPCode.CONFLICT,
			});
		}

		const item = await this.categoryRepository.create(
			CategoryEntity.initializeNew({ key, name }),
		);

		return item.toObject();
	}

	public async findAll(): Promise<
		CollectionResult<CategoryGetAllItemResponseDto>
	> {
		const items = await this.categoryRepository.findAll();

		return { items: items.map((item) => item.toObject()) };
	}

	public async findByName(
		name: string,
	): Promise<CategoryGetAllItemResponseDto> {
		const item = await this.categoryRepository.findByName(name);

		if (!item) {
			throw new RouteCategoryError({
				message: CategoryExceptionMessage.NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return item.toObject();
	}
}

export { CategoryService };
