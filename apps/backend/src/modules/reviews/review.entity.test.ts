import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ReviewEntity } from "./review.entity.js";

describe("ReviewEntity", () => {
	it("should create review entity from existing data", () => {
		const reviewData = {
			content: "Test review content",
			createdAt: "2024-01-01T00:00:00Z",
			id: 1,
			likesCount: 10,
			poiId: 45,
			routeId: null,
			updatedAt: "2024-01-01T00:00:00Z",
			userId: 123,
		};

		const reviewEntity = ReviewEntity.initialize(reviewData);
		const result = reviewEntity.toObject();

		assert.strictEqual(result.id, reviewData.id);
		assert.strictEqual(result.userId, reviewData.userId);
		assert.strictEqual(result.content, reviewData.content);
		assert.strictEqual(result.likesCount, reviewData.likesCount);
		assert.strictEqual(result.routeId, reviewData.routeId);
		assert.strictEqual(result.poiId, reviewData.poiId);
	});

	it("should initialize new review entity without id", () => {
		const reviewData = {
			content: "New review content",
			likesCount: 0,
			poiId: null,
			routeId: 55,
			userId: 123,
		};

		const reviewEntity = ReviewEntity.initializeNew(reviewData);
		const result = reviewEntity.toNewObject();

		assert.strictEqual(result.userId, reviewData.userId);
		assert.strictEqual(result.content, reviewData.content);
		assert.strictEqual(result.likesCount, reviewData.likesCount);
		assert.strictEqual(result.routeId, reviewData.routeId);
		assert.strictEqual(result.poiId, reviewData.poiId);
	});
});
