import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { type PointsOfInterestService } from "../points-of-interest/points-of-interest.service.js";
import { type RoutesService } from "../routes/routes.service.js";
import { ReviewEntity } from "./review.entity.js";
import { type ReviewRepository } from "./review.repository.js";
import { ReviewService } from "./review.service.js";

const FIRST_POI_ID = 1;
const FIRST_COORDINATE = 30.5234;
const SECOND_COORDINATE = 50.4501;

const createMockPointsOfInterestService =
	(): Partial<PointsOfInterestService> => ({
		findById: () =>
			Promise.resolve({
				createdAt: new Date().toISOString(),
				description: "Test POI description",
				id: FIRST_POI_ID,
				location: {
					coordinates: [FIRST_COORDINATE, SECOND_COORDINATE] as [
						number,
						number,
					],
					type: "Point" as const,
				},
				name: "Test POI",
			}),
	});

const createMockRoutesService = (): Partial<RoutesService> => ({
	findById: (id: number) =>
		Promise.resolve({
			createdAt: new Date().toISOString(),
			description: "Route description",
			id,
			name: "Test Route",
			pois: [
				{
					id: 1,
					visitOrder: 1,
				},
				{
					id: 2,
					visitOrder: 2,
				},
			],
			updatedAt: new Date().toISOString(),
		}),
});

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
		const pointsOfInterestService = createMockPointsOfInterestService();
		const routesService = createMockRoutesService();

		const reviewRepository = {
			create: (() =>
				Promise.resolve(reviewEntity)) as ReviewRepository["create"],
			findAll: (() => Promise.resolve([])) as ReviewRepository["findAll"],
		} as ReviewRepository;

		const reviewService = new ReviewService(
			reviewRepository,
			pointsOfInterestService as PointsOfInterestService,
			routesService as RoutesService,
		);

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

		const reviewService = new ReviewService(
			reviewRepository,
			createMockPointsOfInterestService() as PointsOfInterestService,
			createMockRoutesService() as RoutesService,
		);

		const result = await reviewService.findAll();

		assert.deepStrictEqual(result, {
			items: [reviewEntity.toObject()],
		});
	});
});
