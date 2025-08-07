import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ReviewEntity } from "./review.entity.js";
import { type ReviewRepository } from "./review.repository.js";
import { ReviewService } from "./review.service.js";

describe("ReviewService", () => {
	const mockReview: Parameters<typeof ReviewEntity.initialize>[0] = {
		content: "Great route!",
		createdAt: "2025-07-26T12:00:00Z",
		id: 1,
		likesCount: 5,
		poiId: null,
		routeId: 100,
		updatedAt: "2025-07-26T12:30:00Z",
		userId: 10,
	};

	it("create should return new review", async () => {
		const reviewEntity = ReviewEntity.initialize(mockReview);

		const reviewRepository = {
			create: (() =>
				Promise.resolve(reviewEntity)) as ReviewRepository["create"],
			findAll: (() => Promise.resolve([])) as ReviewRepository["findAll"],
		} as ReviewRepository;

		const reviewService = new ReviewService(reviewRepository);

		const result = await reviewService.create({
			content: mockReview.content,
			poiId: mockReview.poiId ?? null,
			routeId: mockReview.routeId ?? null,
			userId: mockReview.userId,
		});

		assert.deepStrictEqual(result, {
			content: mockReview.content,
			id: mockReview.id,
			likesCount: mockReview.likesCount,
			poiId: mockReview.poiId,
			routeId: mockReview.routeId,
			userId: mockReview.userId,
		});
	});

	it("findAll should return all reviews", async () => {
		const reviewEntity = ReviewEntity.initialize(mockReview);

		const reviewRepository = {
			findAll: () => Promise.resolve([reviewEntity]),
		} as ReviewRepository;

		const reviewService = new ReviewService(reviewRepository);

		const result = await reviewService.findAll();

		assert.deepStrictEqual(result, {
			items: [reviewEntity.toObject()],
		});
	});
});
