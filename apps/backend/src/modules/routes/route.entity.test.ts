import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	type Coordinates,
	type LineStringGeometry,
} from "~/libs/types/types.js";

import { RouteEntity } from "./route.entity.js";

describe("RouteEntity", () => {
	const routesDataWithId = {
		createdByUserId: 11,
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
		images: [
			{
				id: 1,
				url: "https://s3.amazonaws.com/test/1.png",
			},
			{
				id: 2,
				url: "https://s3.amazonaws.com/test/2.png",
			},
		],
		name: "Routes 2 Test Name",
		pois: [
			{ id: 1, name: "POI 1 Test Name", visitOrder: 0 },
			{ id: 2, name: "POI 2 Test Name", visitOrder: 1 },
		],
	};

	it("should create new routes entity", () => {
		const routesDataWithOutId = {
			...routesDataWithId,
			id: 1,
			name: "Route 1 Test Name",
			pois: [
				{ id: 1, name: "POI 1 Test Name", visitOrder: 0 },
				{ id: 2, name: "POI 2 Test Name", visitOrder: 1 },
			],
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
