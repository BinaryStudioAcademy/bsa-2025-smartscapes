import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { DatabaseTableName } from "~/libs/modules/database/database.js";

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
