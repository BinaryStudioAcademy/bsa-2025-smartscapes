import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { ReviewEntity } from "./review.entity.js";
import { ReviewModel } from "./review.model.js";
import { ReviewRepository } from "./review.repository.js";

describe("ReviewRepository", () => {
	let reviewRepository: ReviewRepository;
	let databaseTracker: Tracker;

	const mockReviewData: Parameters<typeof ReviewEntity.initialize>[0] = {
		content: "Test review content",
		createdAt: "2025-01-01T00:00:00Z",
		id: 1,
		likesCount: 10,
		poiId: 5,
		routeId: null,
		updatedAt: "2025-01-01T00:00:00Z",
		userId: 42,
	};

	beforeEach(() => {
		const database = knex({ client: MockClient });

		databaseTracker = createTracker(database);

		ReviewModel.knex(database);

		reviewRepository = new ReviewRepository(ReviewModel);
	});

	afterEach(() => {
		databaseTracker.reset();
	});

	it("create should create and return new review", async () => {
		const reviewEntity = ReviewEntity.initialize(mockReviewData);

		databaseTracker.on.insert("reviews").response([reviewEntity]);

		const result = await reviewRepository.create(reviewEntity);

		assert.deepStrictEqual(result, reviewEntity);
	});

	it("findAll should return all reviews", async () => {
		const reviewEntities = [ReviewEntity.initialize(mockReviewData)];

		databaseTracker.on.select("reviews").response(reviewEntities);

		const result = await reviewRepository.findAll();

		assert.deepStrictEqual(result, reviewEntities);
	});
});
