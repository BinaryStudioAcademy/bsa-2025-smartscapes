import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { PointsOfInterestController } from "./points-of-interest.controller.js";
import { type PointsOfInterestService } from "./points-of-interest.service.js";

const mockDelete: PointsOfInterestService["delete"] = () => {
	return Promise.resolve(true);
};

describe("PointsOfInterestController", () => {
	const mockLogger: Logger = {
		debug: () => {},
		error: () => {},
		info: () => {},
		warn: () => {},
	};

	const mockPointOfInterest = {
		id: 1,
		name: "Point Of Interest Test Name",
	};

	it("findAll should return all points of interest", async () => {
		const pointsOfInterest = [mockPointOfInterest];

		const mockFindAll: PointsOfInterestService["findAll"] = () => {
			return Promise.resolve({ items: pointsOfInterest });
		};

		const pointsOfInterestService = {
			findAll: mockFindAll,
		} as PointsOfInterestService;

		const pointsOfInterestController = new PointsOfInterestController(
			mockLogger,
			pointsOfInterestService,
		);

		const result = await pointsOfInterestController.findAll();

		assert.deepStrictEqual(result, {
			payload: {
				data: pointsOfInterest,
			},
			status: HTTPCode.OK,
		});
	});

	it("create should return created point of interest", async () => {
		const mockCreate: PointsOfInterestService["create"] = () => {
			return Promise.resolve(mockPointOfInterest);
		};

		const pointsOfInterestService = {
			create: mockCreate,
		} as PointsOfInterestService;

		const pointsOfInterestController = new PointsOfInterestController(
			mockLogger,
			pointsOfInterestService,
		);

		const result = await pointsOfInterestController.create({
			body: {
				name: mockPointOfInterest.name,
			},
			params: {},
			query: {},
		});

		assert.deepStrictEqual(result, {
			payload: {
				data: mockPointOfInterest,
			},
			status: HTTPCode.OK,
		});
	});

	it("find should return point of interest by id", async () => {
		const mockFind: PointsOfInterestService["findById"] = () => {
			return Promise.resolve(mockPointOfInterest);
		};

		const pointsOfInterestService = {
			findById: mockFind,
		} as PointsOfInterestService;

		const pointsOfInterestController = new PointsOfInterestController(
			mockLogger,
			pointsOfInterestService,
		);

		const result = await pointsOfInterestController.findById({
			body: {},
			params: { id: "1" },
			query: {},
		});

		assert.deepStrictEqual(result, {
			payload: {
				data: mockPointOfInterest,
			},
			status: HTTPCode.OK,
		});
	});

	it("update should return updated point of interest", async () => {
		const updatedPointOfInterest = {
			...mockPointOfInterest,
			name: "Updated Point Of Interest Test Name",
		};

		const mockUpdate: PointsOfInterestService["patch"] = () => {
			return Promise.resolve(updatedPointOfInterest);
		};

		const pointsOfInterestService = {
			patch: mockUpdate,
		} as PointsOfInterestService;

		const pointsOfInterestController = new PointsOfInterestController(
			mockLogger,
			pointsOfInterestService,
		);

		const result = await pointsOfInterestController.patch({
			body: {
				name: updatedPointOfInterest.name,
			},
			params: { id: "1" },
			query: {},
		});

		assert.deepStrictEqual(result, {
			payload: {
				data: updatedPointOfInterest,
			},
			status: HTTPCode.OK,
		});
	});

	it("delete should return deletion status", async () => {
		const pointsOfInterestService = {
			delete: mockDelete,
		} as PointsOfInterestService;

		const pointsOfInterestController = new PointsOfInterestController(
			mockLogger,
			pointsOfInterestService,
		);

		const result = await pointsOfInterestController.delete({
			body: {},
			params: { id: "1" },
			query: {},
		});

		assert.deepStrictEqual(result, {
			payload: {
				data: true,
			},
			status: HTTPCode.OK,
		});
	});
});
