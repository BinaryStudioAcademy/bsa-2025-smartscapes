import { HTTPCode } from "@smartscapes/shared";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	type RouteCategoryGetAllItemResponseDto,
	type RouteCategoryRequestDto,
} from "~/modules/route-categories/route-categories.js";

import { RouteCategoryController } from "./route-category.controller.js";
import { type RouteCategoryService } from "./route-category.service.js";

describe("RouteCategoryController", () => {
	const mockLogger: Logger = {
		debug: () => {},
		error: () => {},
		info: () => {},
		warn: () => {},
	};

	const mockRouteCategory: RouteCategoryGetAllItemResponseDto = {
		id: 1,
		name: "Popular",
	};

	it("create should create and return new route category", async () => {
		const routeCategoryService = {
			create: (() =>
				Promise.resolve(mockRouteCategory)) as RouteCategoryService["create"],
		} as RouteCategoryService;

		const routeCategoryController = new RouteCategoryController(
			mockLogger,
			routeCategoryService,
		);

		const requestOptions = {
			body: {
				name: mockRouteCategory.name,
			},
		} as APIHandlerOptions<{ body: RouteCategoryRequestDto }>;

		const result = await routeCategoryController.create(requestOptions);

		assert.deepStrictEqual(result, {
			payload: { data: mockRouteCategory },
			status: HTTPCode.CREATED,
		});
	});

	it("findAll should return all route categories", async () => {
		const routeCategoryService = {
			findAll: (() =>
				Promise.resolve({
					items: [mockRouteCategory],
				})) as RouteCategoryService["findAll"],
		} as RouteCategoryService;

		const routeCategoryController = new RouteCategoryController(
			mockLogger,
			routeCategoryService,
		);

		const result = await routeCategoryController.findAll();

		assert.deepStrictEqual(result, {
			payload: { data: [mockRouteCategory] },
			status: HTTPCode.OK,
		});
	});
});
