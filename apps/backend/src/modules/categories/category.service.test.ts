import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";

import { CategoryEntity } from "./category.entity.js";
import { type CategoryRepository } from "./category.repository.js";
import { CategoryService } from "./category.service.js";
import { CategoryExceptionMessage } from "./libs/enums/enums.js";
import { RouteCategoryError } from "./libs/exceptions/exceptions.js";

describe("CategoryService", () => {
	const mockRouteCategory: Parameters<typeof CategoryEntity.initialize>[0] = {
		id: 1,
		key: "popular",
		name: "Popular",
	};

	it("create should return new route category", async () => {
		const routeCategoryEntity = CategoryEntity.initialize(mockRouteCategory);

		const routeCategoryRepository = {
			create: (() =>
				Promise.resolve(routeCategoryEntity)) as CategoryRepository["create"],
			findByName: (() =>
				Promise.resolve(null)) as CategoryRepository["findByName"],
		} as CategoryRepository;

		const routeCategoryService = new CategoryService(routeCategoryRepository);

		const result = await routeCategoryService.create({
			key: mockRouteCategory.key,
			name: mockRouteCategory.name,
		});

		assert.deepStrictEqual(result, mockRouteCategory);
	});

	it("create should throw exception if category with such name already exists", async () => {
		const routeCategoryEntity = CategoryEntity.initialize(mockRouteCategory);

		const routeCategoryRepository = {
			create: (() =>
				Promise.resolve(routeCategoryEntity)) as CategoryRepository["create"],
			findByName: (() =>
				Promise.resolve(
					routeCategoryEntity,
				)) as CategoryRepository["findByName"],
		} as CategoryRepository;

		const routeCategoryService = new CategoryService(routeCategoryRepository);

		try {
			await routeCategoryService.create({
				key: mockRouteCategory.key,
				name: mockRouteCategory.name,
			});
			assert.fail("expected exception not thrown");
		} catch (error) {
			assert.ok(error instanceof RouteCategoryError);
			assert.equal(error.message, CategoryExceptionMessage.ALREADY_EXISTS);
			assert.equal(error.status, HTTPCode.CONFLICT);
		}
	});

	it("findAll should return all route categories", async () => {
		const routeCategoryEntity = CategoryEntity.initialize(mockRouteCategory);

		const routeCategoryRepository = {
			findAll: () => Promise.resolve([routeCategoryEntity]),
		} as CategoryRepository;

		const routeCategoryService = new CategoryService(routeCategoryRepository);

		const result = await routeCategoryService.findAll();

		assert.deepStrictEqual(result, { items: [routeCategoryEntity.toObject()] });
	});

	it("findByName should return route category with corresponding name", async () => {
		const routeCategoryEntity = CategoryEntity.initialize(mockRouteCategory);

		const routeCategoryRepository = {
			findByName: (() =>
				Promise.resolve(
					routeCategoryEntity,
				)) as CategoryRepository["findByName"],
		} as CategoryRepository;

		const routeCategoryService = new CategoryService(routeCategoryRepository);

		const result = await routeCategoryService.findByName(
			mockRouteCategory.name,
		);

		assert.deepStrictEqual(result, routeCategoryEntity.toObject());
	});

	it("findByName should throw exception if no category found", async () => {
		const routeCategoryRepository = {
			findByName: (() =>
				Promise.resolve(null)) as CategoryRepository["findByName"],
		} as CategoryRepository;

		const routeCategoryService = new CategoryService(routeCategoryRepository);

		try {
			await routeCategoryService.findByName("Non Existent");
			assert.fail("expected exception not thrown");
		} catch (error) {
			assert.ok(error instanceof RouteCategoryError);
			assert.equal(error.message, CategoryExceptionMessage.NOT_FOUND);
			assert.equal(error.status, HTTPCode.NOT_FOUND);
		}
	});
});
