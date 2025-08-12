import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";

import { RouteCategoryExceptionMessage } from "./libs/enums/enums.js";
import { RouteCategoryError } from "./libs/exceptions/exceptions.js";
import { RouteCategoryEntity } from "./route-category.entity.js";
import { type RouteCategoryRepository } from "./route-category.repository.js";
import { RouteCategoryService } from "./route-category.service.js";

describe("RouteCategoryService", () => {
	const mockRouteCategory: Parameters<
		typeof RouteCategoryEntity.initialize
	>[0] = {
		id: 1,
		name: "Popular",
	};

	it("create should return new route category", async () => {
		const routeCategoryEntity =
			RouteCategoryEntity.initialize(mockRouteCategory);

		const routeCategoryRepository = {
			create: (() =>
				Promise.resolve(
					routeCategoryEntity,
				)) as RouteCategoryRepository["create"],
			findByName: (() =>
				Promise.resolve(null)) as RouteCategoryRepository["findByName"],
		} as RouteCategoryRepository;

		const routeCategoryService = new RouteCategoryService(
			routeCategoryRepository,
		);

		const result = await routeCategoryService.create({
			name: mockRouteCategory.name,
		});

		assert.deepStrictEqual(result, mockRouteCategory);
	});

	it("create should throw exception if category with such name already exists", async () => {
		const routeCategoryEntity =
			RouteCategoryEntity.initialize(mockRouteCategory);

		const routeCategoryRepository = {
			create: (() =>
				Promise.resolve(
					routeCategoryEntity,
				)) as RouteCategoryRepository["create"],
			findByName: (() =>
				Promise.resolve(
					routeCategoryEntity,
				)) as RouteCategoryRepository["findByName"],
		} as RouteCategoryRepository;

		const routeCategoryService = new RouteCategoryService(
			routeCategoryRepository,
		);

		try {
			await routeCategoryService.create({
				name: mockRouteCategory.name,
			});
			assert.fail("expected exception not thrown");
		} catch (error) {
			assert.ok(error instanceof RouteCategoryError);
			assert.equal(error.message, RouteCategoryExceptionMessage.ALREADY_EXISTS);
			assert.equal(error.status, HTTPCode.CONFLICT);
		}
	});

	it("findAll should return all route categories", async () => {
		const routeCategoryEntity =
			RouteCategoryEntity.initialize(mockRouteCategory);

		const routeCategoryRepository = {
			findAll: () => Promise.resolve([routeCategoryEntity]),
		} as RouteCategoryRepository;

		const routeCategoryService = new RouteCategoryService(
			routeCategoryRepository,
		);

		const result = await routeCategoryService.findAll();

		assert.deepStrictEqual(result, { items: [routeCategoryEntity.toObject()] });
	});

	it("findByName should return route category with corresponding name", async () => {
		const routeCategoryEntity =
			RouteCategoryEntity.initialize(mockRouteCategory);

		const routeCategoryRepository = {
			findByName: (() =>
				Promise.resolve(
					routeCategoryEntity,
				)) as RouteCategoryRepository["findByName"],
		} as RouteCategoryRepository;

		const routeCategoryService = new RouteCategoryService(
			routeCategoryRepository,
		);

		const result = await routeCategoryService.findByName(
			mockRouteCategory.name,
		);

		assert.deepStrictEqual(result, routeCategoryEntity.toObject());
	});

	it("findByName should throw exception if no category found", async () => {
		const routeCategoryRepository = {
			findByName: (() =>
				Promise.resolve(null)) as RouteCategoryRepository["findByName"],
		} as RouteCategoryRepository;

		const routeCategoryService = new RouteCategoryService(
			routeCategoryRepository,
		);

		try {
			await routeCategoryService.findByName("Non Existent");
			assert.fail("expected exception not thrown");
		} catch (error) {
			assert.ok(error instanceof RouteCategoryError);
			assert.equal(error.message, RouteCategoryExceptionMessage.NOT_FOUND);
			assert.equal(error.status, HTTPCode.NOT_FOUND);
		}
	});
});
