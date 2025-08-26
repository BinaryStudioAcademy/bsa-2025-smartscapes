import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { DatabaseTableName } from "~/libs/modules/database/database.js";
import {
	type Coordinates,
	type LineStringGeometry,
} from "~/libs/types/types.js";

import { PlannedPathModel } from "../planned-paths/planned-path.model.js";
import { type RouteFindAllOptions } from "./libs/types/types.js";
import { RouteEntity } from "./route.entity.js";
import { RouteModel } from "./route.model.js";
import { RouteRepository } from "./route.repository.js";

const EXISTING_ID = 1;
const NON_EXISTENT_ID = 999;
const DELETED_COUNT = 1;
const NOT_DELETED_COUNT = 0;

describe("RouteRepository", () => {
	let routesRepository: RouteRepository;
	let databaseTracker: Tracker;

	const mockRoute = {
		createdByUserId: 10,
		description: "A test route description",
		distance: 1.23,
		duration: 4.56,
		geometry: {
			coordinates: [
				[30.5234, 50.4501],
				[30.524, 50.451],
			] as Coordinates[],
			type: "LineString",
		} as LineStringGeometry,
		id: 1,
		images: [
			{
				id: 1,
				url: "https://s3.amazonaws.com/test/1.png",
			},
			{
				id: 2,
				url: "https://s3.amazonaws.com/test/2.png",
			},
		],
		name: "Test Route",
		pois: [{ id: 1, name: "Test POI", visitOrder: 1 }],
	};

	const mockRouteList = {
		createdByUserId: mockRoute.createdByUserId,
		distance: mockRoute.distance,
		duration: mockRoute.duration,
		geometry: mockRoute.geometry,
		id: mockRoute.id,
		images: [],
		name: mockRoute.name,
		pois: [] as { id: number; name: string; visitOrder: number }[],
	};

	const createMockRouteEntity = (): RouteEntity =>
		RouteEntity.initialize(mockRoute);

	beforeEach(() => {
		const database = knex({ client: MockClient });

		databaseTracker = createTracker(database);

		RouteModel.knex(database);

		routesRepository = new RouteRepository(RouteModel, PlannedPathModel);
	});

	afterEach(() => {
		databaseTracker.reset();
	});

	it("create should create and return new route", async () => {
		const routeEntity = createMockRouteEntity();
		const routeObject = {
			...routeEntity.toObject(),
			id: null,
			images: [],
		};

		databaseTracker.on.insert(DatabaseTableName.ROUTES).response([routeObject]);
		databaseTracker.on.insert(DatabaseTableName.ROUTES_TO_POIS).response([]);

		const result = await RouteModel.knex().transaction(async (trx) => {
			const created = await routesRepository.create(routeEntity, {
				transaction: trx,
			});

			return created;
		});

		assert.deepStrictEqual(result.toObject(), routeObject);
	});

	it("find should return null when route not found", async () => {
		databaseTracker.on.select(DatabaseTableName.ROUTES).response([]);

		const result = await routesRepository.findById(NON_EXISTENT_ID);

		assert.strictEqual(result, null);
	});

	it("findAll should return all routes if options are not provided", async () => {
		const mockRouteEntity = RouteEntity.initializeList(mockRouteList);
		const mockRouteObject = mockRouteEntity.toObject();

		databaseTracker.on
			.select(DatabaseTableName.ROUTES)
			.response([mockRouteObject]);

		databaseTracker.on.select(DatabaseTableName.FILES).response([]);

		const result = await routesRepository.findAll(null);

		assert.deepStrictEqual(result, [mockRouteEntity]);
	});

	it("findAll should return routes matching search query", async () => {
		const mockRouteEntity = RouteEntity.initializeList(mockRouteList);
		const mockRouteObject = mockRouteEntity.toObject();

		const mockOptions: RouteFindAllOptions = {
			categories: ["entertaiment", "history"],
			name: mockRouteObject.name.toLowerCase(),
		};

		databaseTracker.on
			.select(DatabaseTableName.ROUTES)
			.response([mockRouteObject]);

		databaseTracker.on.select(DatabaseTableName.FILES).response([]);

		const result = await routesRepository.findAll(mockOptions);

		assert.deepStrictEqual(result, [mockRouteEntity]);
	});

	it("findAll should return empty array if no routes found", async () => {
		const mockOptions: RouteFindAllOptions = { name: "nonexistent" };

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
