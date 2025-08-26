import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { type PointsOfInterestService } from "../points-of-interest/points-of-interest.service.js";
import { type RouteService } from "../routes/route.service.js";
import { type UserAuthResponseDto } from "../users/users.js";
import { type ReviewGetByIdResponseDto } from "./libs/types/types.js";
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
				routes: [],
			}),
	});

const createMockRouteService = (): Partial<RouteService> => ({
	findById: (id: number) =>
		Promise.resolve({
			createdByUserId: 10,
			description: "Route description",
			distance: 1.23,
			duration: 4.56,
			geometry: {
				coordinates: [
					[FIRST_COORDINATE, SECOND_COORDINATE],
					[SECOND_COORDINATE, FIRST_COORDINATE],
				] as [number, number][],
				type: "LineString" as const,
			},
			id,
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
			pois: [
				{
					id: 1,
					name: "SUP Kayak Club 4 Storony",
					visitOrder: 1,
				},
				{
					id: 2,
					name: "River Grill, Rusanivska Embankment",
					visitOrder: 2,
				},
			],
		}),
});

describe("ReviewService", () => {
	const mockReviewDB: Parameters<typeof ReviewEntity.initialize>[0] = {
		content: "Great route!",
		createdAt: "2025-07-26T12:00:00Z",
		id: 1,
		likesCount: 5,
		poiId: null,
		routeId: 100,
		updatedAt: "2025-07-26T12:30:00Z",
		userId: 10,
	};

	const currentUser: Pick<
		UserAuthResponseDto,
		"avatarUrl" | "firstName" | "id" | "lastName"
	> = {
		avatarUrl: null,
		firstName: "John",
		id: 10,
		lastName: "Doe",
	};

	it("create should return new review", async () => {
		const reviewEntity = ReviewEntity.initialize(mockReviewDB);

		const pointsOfInterestService = createMockPointsOfInterestService();
		const routeService = createMockRouteService();

		const reviewRepository = {
			create: (() =>
				Promise.resolve(reviewEntity)) as ReviewRepository["create"],
			findAll: (() => Promise.resolve([])) as ReviewRepository["findAll"],
		} as ReviewRepository;

		const reviewService = new ReviewService(
			reviewRepository,
			pointsOfInterestService as PointsOfInterestService,
			routeService as RouteService,
		);

		const result = await reviewService.create({
			content: mockReviewDB.content,
			poiId: mockReviewDB.poiId,
			routeId: mockReviewDB.routeId,
			user: {
				avatarUrl: currentUser.avatarUrl,
				firstName: currentUser.firstName,
				id: currentUser.id,
				lastName: currentUser.lastName,
			},
			userId: currentUser.id,
		});

		const expected: ReviewGetByIdResponseDto = {
			content: mockReviewDB.content,
			id: mockReviewDB.id,
			likesCount: mockReviewDB.likesCount,
			poiId: mockReviewDB.poiId,
			routeId: mockReviewDB.routeId,
			user: {
				avatarUrl: currentUser.avatarUrl,
				firstName: currentUser.firstName,
				id: currentUser.id,
				lastName: currentUser.lastName,
			},
		};

		assert.deepStrictEqual(result, expected);
	});

	it("findAll should return all reviews", async () => {
		const row = {
			content: mockReviewDB.content,
			id: mockReviewDB.id,
			likesCount: mockReviewDB.likesCount,
			poiId: mockReviewDB.poiId,
			routeId: mockReviewDB.routeId,
			user: {
				avatar: null,
				firstName: currentUser.firstName,
				id: currentUser.id,
				lastName: currentUser.lastName,
			},
		};

		const expected: ReviewGetByIdResponseDto = {
			content: mockReviewDB.content,
			id: mockReviewDB.id,
			likesCount: mockReviewDB.likesCount,
			poiId: mockReviewDB.poiId,
			routeId: mockReviewDB.routeId,
			user: {
				avatarUrl: currentUser.avatarUrl,
				firstName: currentUser.firstName,
				id: currentUser.id,
				lastName: currentUser.lastName,
			},
		};

		const rowEntity = ReviewEntity.initializeList({
			content: row.content,
			id: row.id,
			likesCount: row.likesCount,
			poiId: row.poiId,
			routeId: row.routeId,
			user: {
				avatarUrl: expected.user.avatarUrl,
				firstName: row.user.firstName,
				id: row.user.id,
				lastName: row.user.lastName,
			},
			userId: currentUser.id,
		});

		const reviewRepository = {
			findAll: (() =>
				Promise.resolve([rowEntity])) as ReviewRepository["findAll"],
		} as ReviewRepository;

		const reviewService = new ReviewService(
			reviewRepository,
			createMockPointsOfInterestService() as PointsOfInterestService,
			createMockRouteService() as RouteService,
		);

		const result = await reviewService.findAll(null);

		assert.deepStrictEqual(result, { items: [expected] });
	});
});
