import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { PointsOfInterestEntity } from "./points-of-interest.entity.js";
import { PointsOfInterestModel } from "./points-of-interest.model.js";
import { PointsOfInterestRepository } from "./points-of-interest.repository.js";

const EXISTING_ID = 1;
const NON_EXISTENT_ID = 999;
const DELETED_COUNT = 1;
const NOT_DELETED_COUNT = 0;

const TEST_LONGITUDE = 30.5234;
const TEST_LATITUDE = 50.4501;
const TEST_COORDINATES: [number, number] = [TEST_LONGITUDE, TEST_LATITUDE];

describe("PointsOfInterestRepository", () => {
	let pointsOfInterestRepository: PointsOfInterestRepository;
	let databaseTracker: Tracker;

	const mockPointOfInterest: Parameters<
		typeof PointsOfInterestEntity.initialize
	>[0] = {
		createdAt: "2024-01-01T00:00:00Z",
		id: 1,
		location: {
			coordinates: TEST_COORDINATES,
			type: "Point" as const,
		},
		name: "Point Of Interest Test Name",
		updatedAt: "2024-01-01T00:00:00Z",
	};

	const createMockEntity = (): PointsOfInterestEntity =>
		PointsOfInterestEntity.initialize(mockPointOfInterest);

	beforeEach(() => {
		const database = knex({ client: MockClient });

		databaseTracker = createTracker(database);

		PointsOfInterestModel.knex(database);

		pointsOfInterestRepository = new PointsOfInterestRepository(
			PointsOfInterestModel,
		);
	});

	afterEach(() => {
		databaseTracker.reset();
	});

	it("create should create and return new point of interest", async () => {
		const pointOfInterestEntity = createMockEntity();

		databaseTracker.on
			.insert(DatabaseTableName.POINTS_OF_INTEREST)
			.response([pointOfInterestEntity]);

		const result = await pointsOfInterestRepository.create(
			pointOfInterestEntity,
		);

		assert.deepStrictEqual(result, pointOfInterestEntity);
	});

	it("findAll should return all points of interest", async () => {
		const pointOfInterestEntities = [createMockEntity()];

		databaseTracker.on
			.select(DatabaseTableName.POINTS_OF_INTEREST)
			.response(pointOfInterestEntities);

		const result = await pointsOfInterestRepository.findAll(null);

		assert.deepStrictEqual(result, pointOfInterestEntities);
	});

	it("findNearby should return nearby points of interest", async () => {
		const pointOfInterestEntities = [createMockEntity()];

		databaseTracker.on
			.select(DatabaseTableName.POINTS_OF_INTEREST)
			.response(pointOfInterestEntities);

		const result = await pointsOfInterestRepository.findNearby({
			latitude: TEST_LATITUDE,
			longitude: TEST_LONGITUDE,
			radius: 5,
		});

		assert.deepStrictEqual(result, pointOfInterestEntities);
	});

	it("findNearby should use default radius when not provided", async () => {
		const pointOfInterestEntities = [createMockEntity()];

		databaseTracker.on
			.select(DatabaseTableName.POINTS_OF_INTEREST)
			.response(pointOfInterestEntities);

		const result = await pointsOfInterestRepository.findNearby({
			latitude: TEST_LATITUDE,
			longitude: TEST_LONGITUDE,
			radius: 5,
		});

		assert.deepStrictEqual(result, pointOfInterestEntities);
	});

	it("find should return point of interest by id", async () => {
		const pointOfInterestEntity =
			PointsOfInterestEntity.initialize(mockPointOfInterest);

		databaseTracker.on
			.select(DatabaseTableName.POINTS_OF_INTEREST)
			.response([pointOfInterestEntity]);

		const result = await pointsOfInterestRepository.findById(EXISTING_ID);

		assert.deepStrictEqual(result, pointOfInterestEntity);
	});

	it("find should return null when point of interest not found", async () => {
		databaseTracker.on.select("points_of_interest").response([]);

		const result = await pointsOfInterestRepository.findById(NON_EXISTENT_ID);

		assert.strictEqual(result, null);
	});

	it("findByName should return point of interest by name", async () => {
		const pointOfInterestEntity = createMockEntity();

		databaseTracker.on
			.select(DatabaseTableName.POINTS_OF_INTEREST)
			.response([pointOfInterestEntity]);

		const result = await pointsOfInterestRepository.findByName(
			"Point Of Interest Test Name",
		);

		assert.deepStrictEqual(result, pointOfInterestEntity);
	});

	it("findByName should return null when point of interest not found", async () => {
		databaseTracker.on
			.select(DatabaseTableName.POINTS_OF_INTEREST)
			.response([]);

		const result =
			await pointsOfInterestRepository.findByName("Non-existent Park");

		assert.strictEqual(result, null);
	});

	it("update should update and return point of interest", async () => {
		const updatedPointOfInterest = {
			...mockPointOfInterest,
			name: "Updated Point Of Interest Test Name",
		};
		const pointOfInterestEntity = PointsOfInterestEntity.initialize(
			updatedPointOfInterest,
		);

		databaseTracker.on
			.select(DatabaseTableName.POINTS_OF_INTEREST)
			.response([pointOfInterestEntity]);

		databaseTracker.on
			.update(DatabaseTableName.POINTS_OF_INTEREST)
			.response([pointOfInterestEntity]);

		const result = await pointsOfInterestRepository.patch(
			EXISTING_ID,
			pointOfInterestEntity,
		);

		assert.deepStrictEqual(result, pointOfInterestEntity);
	});

	it("delete should return true when point of interest deleted", async () => {
		databaseTracker.on
			.delete(DatabaseTableName.POINTS_OF_INTEREST)
			.response(DELETED_COUNT);

		const result = await pointsOfInterestRepository.delete(EXISTING_ID);

		assert.strictEqual(result, true);
	});

	it("delete should return false when point of interest not found", async () => {
		databaseTracker.on
			.delete(DatabaseTableName.POINTS_OF_INTEREST)
			.response(NOT_DELETED_COUNT);

		const result = await pointsOfInterestRepository.delete(NON_EXISTENT_ID);

		assert.strictEqual(result, false);
	});
});
