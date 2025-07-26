import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PointsOfInterestEntity } from "./points-of-interest.entity.js";

describe("PointsOfInterestEntity", () => {
	it("should create new points of interest entity", () => {
		const pointOfInterestData = {
			createdAt: "2024-01-01T00:00:00Z",
			id: 1,
			name: "Point Of Interest Test Name",
			updatedAt: "2024-01-01T00:00:00Z",
		};

		const pointOfInterestEntity =
			PointsOfInterestEntity.initialize(pointOfInterestData);
		const result = pointOfInterestEntity.toObject();

		assert.strictEqual(result.id, pointOfInterestData.id);
		assert.strictEqual(result.name, pointOfInterestData.name);
	});

	it("should initialize new points of interest without id", () => {
		const pointOfInterestData = {
			name: "Point Of Interest Test Name",
		};

		const pointOfInterestEntity =
			PointsOfInterestEntity.initializeNew(pointOfInterestData);
		const result = pointOfInterestEntity.toNewObject();

		assert.strictEqual(result.name, pointOfInterestData.name);
	});
});
