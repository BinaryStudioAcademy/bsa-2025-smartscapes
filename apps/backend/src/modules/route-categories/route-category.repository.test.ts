import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { RouteCategoryEntity } from "./route-category.entity.js";
import { RouteCategoryModel } from "./route-category.model.js";
import { RouteCategoryRepository } from "./route-category.repository.js";

describe("RouteCategoryRepository", () => {
	let routeCategoryRepository: RouteCategoryRepository;
	let databaseTracker: Tracker;

	const mockRouteCategory: Parameters<
		typeof RouteCategoryEntity.initialize
	>[0] = {
		id: 1,
		name: "Popular",
	};

	beforeEach(() => {
		const database = knex({ client: MockClient });

		databaseTracker = createTracker(database);

		RouteCategoryModel.knex(database);

		routeCategoryRepository = new RouteCategoryRepository(RouteCategoryModel);
	});

	afterEach(() => {
		databaseTracker.reset();
	});

	it("create should create and return new route category", async () => {
		const routeCategoryEntity =
			RouteCategoryEntity.initialize(mockRouteCategory);

		databaseTracker.on
			.insert("route_categories")
			.response([routeCategoryEntity]);

		const result = await routeCategoryRepository.create(routeCategoryEntity);

		assert.deepStrictEqual(result, routeCategoryEntity);
	});

	it("findAll should return all route categories", async () => {
		const routeCategoryEntities = [
			RouteCategoryEntity.initialize(mockRouteCategory),
		];

		databaseTracker.on
			.select("route_categories")
			.response(routeCategoryEntities);

		const result = await routeCategoryRepository.findAll();

		assert.deepStrictEqual(result, routeCategoryEntities);
	});

	it("findByName should return route category entity by name", async () => {
		const routeCategoryEntity =
			RouteCategoryEntity.initialize(mockRouteCategory);

		databaseTracker.on
			.select("route_categories")
			.response([routeCategoryEntity]);

		const result = await routeCategoryRepository.findByName(
			mockRouteCategory.name,
		);

		assert.deepStrictEqual(result, routeCategoryEntity);
	});

	it("findByName should return null if no category found", async () => {
		databaseTracker.on.select("route_categories").response([]);

		const result = await routeCategoryRepository.findByName("Non Existent");

		assert.strictEqual(result, null);
	});
});
