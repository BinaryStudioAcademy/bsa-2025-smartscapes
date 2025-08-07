import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type UserAuthResponseDto } from "~/libs/types/types.js";

import { ReviewController } from "./review.controller.js";
import { type ReviewService } from "./review.service.js";

describe("ReviewController", () => {
	const mockLogger: Logger = {
		debug: () => {},
		error: () => {},
		info: () => {},
		warn: () => {},
	};

	const mockUser = {
		email: "test@example.com",
		firstName: "John",
		id: 1,
		lastName: "Doe",
	} satisfies UserAuthResponseDto;

	const mockReview = {
		content: "content",
		id: 1,
		likesCount: 5,
		poiId: null,
		routeId: 10,
		userId: mockUser.id,
	};

	it("findAll should return all reviews", async () => {
		const reviews = [mockReview];

		const mockFindAll: ReviewService["findAll"] = () => {
			return Promise.resolve({ items: reviews });
		};

		const reviewService = {
			findAll: mockFindAll,
		} as ReviewService;

		const reviewController = new ReviewController(mockLogger, reviewService);

		const result = await reviewController.findAll();

		assert.deepStrictEqual(result, {
			payload: { data: reviews },
			status: HTTPCode.OK,
		});
	});

	it("create should create a review and return it", async () => {
		const review = mockReview;

		const mockCreate: ReviewService["create"] = () => {
			return Promise.resolve(review);
		};

		const reviewService = {
			create: mockCreate,
		} as ReviewService;

		const reviewController = new ReviewController(mockLogger, reviewService);

		const result = await reviewController.create({
			body: {
				content: review.content,
				poiId: review.poiId,
				routeId: review.routeId,
			},
			params: {},
			query: {},
			user: mockUser,
		});

		assert.deepStrictEqual(result, {
			payload: { data: review },
			status: HTTPCode.CREATED,
		});
	});
});
