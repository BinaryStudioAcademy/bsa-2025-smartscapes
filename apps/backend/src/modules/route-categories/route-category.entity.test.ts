import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { RouteCategoryEntity } from "./route-category.entity.js";

describe("RouteCategoryEntity", () => {
	it("should create new route category entity", () => {
		const routeCategoryData = {
			id: 1,
			name: "Popular",
		};

		const routeCategoryEntity =
			RouteCategoryEntity.initialize(routeCategoryData);
		const result = routeCategoryEntity.toObject();

		assert.strictEqual(result.name, routeCategoryData.name);
		assert.strictEqual(result.id, routeCategoryData.id);
		assert.ok(routeCategoryEntity instanceof RouteCategoryEntity);
	});

	it("should initialize new route category without id", () => {
		const routeCategoryData = {
			name: "Popular",
		};

		const routeCategoryEntity =
			RouteCategoryEntity.initializeNew(routeCategoryData);
		const result = routeCategoryEntity.toNewObject();

		assert.strictEqual(result.name, routeCategoryData.name);
		assert.ok(!Object.hasOwn(result, "id"));
		assert.ok(routeCategoryEntity instanceof RouteCategoryEntity);
	});
});
