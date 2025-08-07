import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { RoutesEntity } from "./routes.entity.js";

describe("RoutesEntity", () => {
	it("should create new routes entity", () => {
		const routesData = {
			description: "A test route description",
			id: 1,
			name: "Routes 1 Test Name",
			pois: [
				{ id: 1, visitOrder: 0 },
				{ id: 2, visitOrder: 1 },
			],
		};

		const routesEntity = RoutesEntity.initialize(routesData);
		const result = routesEntity.toObject();

		assert.strictEqual(result.id, routesData.id);
		assert.strictEqual(result.name, routesData.name);
		assert.strictEqual(result.description, routesData.description);
		assert.strictEqual(result.pois, routesData.pois);
	});

	it("should initialize new routes without id", () => {
		const routesData = {
			description: "A test route description",
			name: "Routes 2 Test Name",
			pois: [
				{ id: 1, visitOrder: 0 },
				{ id: 2, visitOrder: 1 },
			],
		};

		const routesEntity = RoutesEntity.initializeNew(routesData);
		const result = routesEntity.toObject();

		assert.strictEqual(result.name, routesData.name);
		assert.strictEqual(result.description, routesData.description);
		assert.strictEqual(result.pois, routesData.pois);
	});
});
