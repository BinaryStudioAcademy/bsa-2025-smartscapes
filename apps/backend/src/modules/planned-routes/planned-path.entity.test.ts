import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	type Coordinates,
	type LineStringGeometry,
} from "~/libs/types/types.js";

import { PlannedPathEntity } from "./planned-path.entity.js";

describe("PlannedPathEntity", () => {
	const geometry: LineStringGeometry = {
		coordinates: [
			[30.5234, 50.4501],
			[30.524, 50.451],
		] as Coordinates[],
		type: "LineString",
	};

	const dataWithoutId = {
		distance: 1.23,
		duration: 4.56,
		geometry,
	};

	it("should create planned route entity from existing data", () => {
		const dataWithId = {
			...dataWithoutId,
			id: 1,
		};

		const entity = PlannedPathEntity.initialize(dataWithId);
		const result = entity.toObject();

		assert.equal(result.id, dataWithId.id);
		assert.equal(result.distance, dataWithId.distance);
		assert.equal(result.duration, dataWithId.duration);
		assert.deepEqual(result.geometry, dataWithId.geometry);
	});

	it("should initialize new planned route without id", () => {
		const entity = PlannedPathEntity.initializeNew(dataWithoutId);
		const result = entity.toObject();

		assert.equal(result.distance, dataWithoutId.distance);
		assert.equal(result.duration, dataWithoutId.duration);
		assert.deepEqual(result.geometry, dataWithoutId.geometry);
	});
});
