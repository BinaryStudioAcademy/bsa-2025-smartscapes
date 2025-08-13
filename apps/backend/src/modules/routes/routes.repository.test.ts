import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { type RoutesFindAllRequestDto } from "./libs/types/types.js";
import { RoutesEntity } from "./routes.entity.js";
import { RoutesModel } from "./routes.model.js";
import { RoutesRepository } from "./routes.repository.js";

const EXISTING_ID = 1;
const NON_EXISTENT_ID = 999;
const DELETED_COUNT = 1;
const NOT_DELETED_COUNT = 0;

describe("RoutesRepository", () => {
	let routesRepository: RoutesRepository;
	let databaseTracker: Tracker;

	const mockRoute = {
		description: "A test route description",
		id: 1,
		name: "Test Route",
	};

	const createMockRouteEntity = (): RoutesEntity =>
		RoutesEntity.initialize({
			...mockRoute,
			pois: [{ id: 1, visitOrder: 1 }],
		});

	beforeEach(() => {
		const database = knex({ client: MockClient });

		databaseTracker = createTracker(database);

		RoutesModel.knex(database);

		routesRepository = new RoutesRepository(RoutesModel);
	});

	afterEach(() => {
		databaseTracker.reset();
	});

	it("create should create and return new route", async () => {
		const routeEntity = createMockRouteEntity();
		const routeObject = routeEntity.toObject();

		databaseTracker.on.insert(DatabaseTableName.ROUTES).response([routeObject]);
		databaseTracker.on.insert(DatabaseTableName.ROUTES_TO_POIS).response([]);

		const result = await routesRepository.create(routeEntity);

		assert.deepStrictEqual(structuredClone(result), routeObject);
	});

	it("find should return null when route not found", async () => {
		databaseTracker.on.select(DatabaseTableName.ROUTES).response([]);

		const result = await routesRepository.findById(NON_EXISTENT_ID);

		assert.strictEqual(result, null);
	});

	it("findAll should return all routes if options are not provided", async () => {
		const mockRouteEntity = RoutesEntity.initialize({
			...mockRoute,
			pois: [],
		});
		const mockRouteObject = mockRouteEntity.toObject();

		databaseTracker.on
			.select(DatabaseTableName.ROUTES)
			.response([mockRouteObject]);

		const result = await routesRepository.findAll(null);

		assert.deepStrictEqual(result, [mockRouteEntity]);
	});

	it("findAll should return routes matching search query", async () => {
		const mockRouteEntity = RoutesEntity.initialize({ ...mockRoute, pois: [] });
		const mockRouteObject = mockRouteEntity.toObject();

		const mockOptions: RoutesFindAllRequestDto = {
			categories: ["entertaiment", "history"],
			name: mockRouteObject.name.toLowerCase(),
		};

		databaseTracker.on
			.select(DatabaseTableName.ROUTES)
			.response([mockRouteObject]);

		const result = await routesRepository.findAll(mockOptions);

		assert.deepStrictEqual(result, [mockRouteEntity]);
	});

	it("findAll should return empty array if no routes found", async () => {
		const mockOptions: RoutesFindAllRequestDto = { name: "nonexistent" };

		databaseTracker.on.select(DatabaseTableName.ROUTES).response([]);

		const result = await routesRepository.findAll(mockOptions);

		assert.deepStrictEqual(result, []);
	});

	it("delete should return true when route deleted", async () => {
		databaseTracker.on
			.delete(DatabaseTableName.ROUTES_TO_POIS)
			.response(DELETED_COUNT);

		databaseTracker.on.delete(DatabaseTableName.ROUTES).response(DELETED_COUNT);

		const result = await routesRepository.delete(EXISTING_ID);

		assert.strictEqual(result, true);
	});

	it("delete should return false when route not found", async () => {
		databaseTracker.on
			.delete(DatabaseTableName.ROUTES_TO_POIS)
			.response(NOT_DELETED_COUNT);

		databaseTracker.on
			.delete(DatabaseTableName.ROUTES)
			.response(NOT_DELETED_COUNT);

		const result = await routesRepository.delete(NON_EXISTENT_ID);

		assert.strictEqual(result, false);
	});
});
