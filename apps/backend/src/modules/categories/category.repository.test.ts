import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { CategoryEntity } from "./category.entity.js";
import { CategoryModel } from "./category.model.js";
import { CategoryRepository } from "./category.repository.js";

describe("CategoryRepository", () => {
	let route: CategoryRepository;
	let databaseTracker: Tracker;

	const mockCategoryRepositoryCategory: Parameters<
		typeof CategoryEntity.initialize
	>[0] = {
		id: 1,
		key: "popular",
		name: "Popular",
	};

	beforeEach(() => {
		const database = knex({ client: MockClient });

		databaseTracker = createTracker(database);

		CategoryModel.knex(database);

		route = new CategoryRepository(CategoryModel);
	});

	afterEach(() => {
		databaseTracker.reset();
	});

	it("create should create and return new route category", async () => {
		const categoryEntity = CategoryEntity.initialize(
			mockCategoryRepositoryCategory,
		);

		databaseTracker.on.insert("categories").response([categoryEntity]);

		const result = await route.create(categoryEntity);

		assert.deepStrictEqual(result, categoryEntity);
	});

	it("findAll should return all route categories", async () => {
		const routeCategoryEntities = [
			CategoryEntity.initialize(mockCategoryRepositoryCategory),
		];

		databaseTracker.on.select("categories").response(routeCategoryEntities);

		const result = await route.findAll();

		assert.deepStrictEqual(result, routeCategoryEntities);
	});

	it("findByName should return route category entity by name", async () => {
		const categoryEntity = CategoryEntity.initialize(
			mockCategoryRepositoryCategory,
		);

		databaseTracker.on.select("categories").response([categoryEntity]);

		const result = await route.findByName(mockCategoryRepositoryCategory.name);

		assert.deepStrictEqual(result, categoryEntity);
	});

	it("findByName should return null if no category found", async () => {
		databaseTracker.on.select("categories").response([]);

		const result = await route.findByName("Non Existent");

		assert.strictEqual(result, null);
	});
});
