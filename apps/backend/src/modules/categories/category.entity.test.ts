import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CategoryEntity } from "./category.entity.js";

describe("CategoryEntity", () => {
	it("should create new route category entity", () => {
		const categoryData = {
			id: 1,
			key: "popular",
			name: "Popular",
		};

		const categoryEntity = CategoryEntity.initialize(categoryData);
		const result = categoryEntity.toObject();

		assert.strictEqual(result.name, categoryData.name);
		assert.strictEqual(result.id, categoryData.id);
		assert.ok(categoryEntity instanceof CategoryEntity);
	});

	it("should initialize new route category without id", () => {
		const categoryData = {
			key: "popular",
			name: "Popular",
		};

		const categoryEntity = CategoryEntity.initializeNew(categoryData);
		const result = categoryEntity.toNewObject();

		assert.strictEqual(result.name, categoryData.name);
		assert.ok(!Object.hasOwn(result, "id"));
		assert.ok(categoryEntity instanceof CategoryEntity);
	});
});
