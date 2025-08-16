import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { DatabaseTableName } from "~/libs/modules/database/database.js";
import {
	type Coordinates,
	type LineStringGeometry,
} from "~/libs/types/types.js";

import { PlannedPathEntity } from "./planned-path.entity.js";
import { PlannedPathModel } from "./planned-path.model.js";
import { PlannedPathRepository } from "./planned-path.repository.js";

describe("PlannedPathRepository", () => {
	let repository: PlannedPathRepository;
	let tracker: Tracker;

	const geometry: LineStringGeometry = {
		coordinates: [
			[30.5234, 50.4501],
			[30.524, 50.451],
		] as Coordinates[],
		type: "LineString",
	};

	const existing = {
		distance: 1.23,
		duration: 4.56,
		geometry,
		id: 1,
	};

	beforeEach(() => {
		const database = knex({ client: MockClient });
		tracker = createTracker(database);
		PlannedPathModel.knex(database);
		repository = new PlannedPathRepository(PlannedPathModel);
	});

	afterEach(() => {
		tracker.reset();
	});

	it("create should insert and return planned route", async () => {
		const entity = PlannedPathEntity.initialize(existing);
		const object = entity.toObject();

		tracker.on.insert(DatabaseTableName.PLANNED_PATHS).response([object]);

		const created = await repository.create(
			PlannedPathEntity.initializeNew({
				distance: existing.distance,
				duration: existing.duration,
				geometry: existing.geometry,
			}),
		);

		assert.deepStrictEqual(created.toObject(), object);
	});

	it("findById should return item when exists", async () => {
		tracker.on.select(DatabaseTableName.PLANNED_PATHS).response([existing]);

		const found = await repository.findById(existing.id);

		assert.deepStrictEqual(found?.toObject(), existing);
	});

	it("findById should return null when not found", async () => {
		tracker.on.select(DatabaseTableName.PLANNED_PATHS).response([]);

		const found = await repository.findById(999);

		assert.equal(found, null);
	});

	it("delete should return true on success", async () => {
		tracker.on.delete(DatabaseTableName.PLANNED_PATHS).response(1);

		const isDeleted = await repository.delete(existing.id);

		assert.equal(isDeleted, true);
	});

	it("delete should return false on miss", async () => {
		tracker.on.delete(DatabaseTableName.PLANNED_PATHS).response(0);

		const isDeleted = await repository.delete(999);

		assert.equal(isDeleted, false);
	});
});
