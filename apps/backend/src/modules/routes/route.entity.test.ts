import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	type Coordinates,
	type LineStringGeometry,
} from "~/libs/types/types.js";

import { RouteEntity } from "./route.entity.js";

describe("RouteEntity", () => {
	const routesDataWithId = {
		description: "A test route description",
		distance: 2.34,
		duration: 7.89,
		geometry: {
			coordinates: [
				[30.5234, 50.4501],
				[30.524, 50.451],
			] as Coordinates[],
			type: "LineString",
		} satisfies LineStringGeometry,
		name: "Routes 2 Test Name",
		pois: [
			{ id: 1, visitOrder: 0 },
			{ id: 2, visitOrder: 1 },
		],
		userId: 11,
	};

	it("should create new routes entity", () => {
		const routesDataWithOutId = {
			...routesDataWithId,
			id: 1,
		};

		const routesEntity = RouteEntity.initialize(routesDataWithOutId);
		const result = routesEntity.toObject();

		assert.strictEqual(result.id, routesDataWithOutId.id);
		assert.strictEqual(result.name, routesDataWithOutId.name);
		assert.strictEqual(result.description, routesDataWithOutId.description);
		assert.strictEqual(result.pois, routesDataWithOutId.pois);
	});

	it("should initialize new routes without id", () => {
		const routesEntity = RouteEntity.initializeNew(routesDataWithId);
		const result = routesEntity.toObject();

		assert.strictEqual(result.name, routesDataWithId.name);
		assert.strictEqual(result.description, routesDataWithId.description);
		assert.strictEqual(result.pois, routesDataWithId.pois);
	});
});
