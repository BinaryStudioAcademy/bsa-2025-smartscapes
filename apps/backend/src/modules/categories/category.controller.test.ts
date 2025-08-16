import { HTTPCode } from "@smartscapes/shared";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type CategoryGetAllItemResponseDto } from "~/modules/categories/categories.js";

import { CategoryController } from "./category.controller.js";
import { type CategoryService } from "./category.service.js";
import { type CategoryCreateRequestDto } from "./libs/types/types.js";

describe("CategoryController", () => {
	const mockLogger: Logger = {
		debug: () => {},
		error: () => {},
		info: () => {},
		warn: () => {},
	};

	const mockCategory: CategoryGetAllItemResponseDto = {
		id: 1,
		name: "Popular",
	};

	it("create should create and return new route category", async () => {
		const routeCategoryService = {
			create: (() =>
				Promise.resolve(mockCategory)) as CategoryService["create"],
		} as CategoryService;

		const routeCategoryController = new CategoryController(
			mockLogger,
			routeCategoryService,
		);

		const requestOptions = {
			body: {
				name: mockCategory.name,
			},
		} as APIHandlerOptions<{ body: CategoryCreateRequestDto }>;

		const result = await routeCategoryController.create(requestOptions);

		assert.deepStrictEqual(result, {
			payload: { data: mockCategory },
			status: HTTPCode.CREATED,
		});
	});

	it("findAll should return all route categories", async () => {
		const routeCategoryService = {
			findAll: (() =>
				Promise.resolve({
					items: [mockCategory],
				})) as CategoryService["findAll"],
		} as CategoryService;

		const routeCategoryController = new CategoryController(
			mockLogger,
			routeCategoryService,
		);

		const result = await routeCategoryController.findAll();

		assert.deepStrictEqual(result, {
			payload: { data: [mockCategory] },
			status: HTTPCode.OK,
		});
	});
});
