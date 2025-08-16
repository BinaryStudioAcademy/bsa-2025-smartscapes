import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";
import {
	type Coordinates,
	type LineStringGeometry,
} from "~/libs/types/types.js";

import { PlannedPathExceptionMessage } from "./libs/enums/enums.js";
import { type PlannedPathEntity } from "./planned-path.entity.js";
import { type PlannedPathRepository } from "./planned-path.repository.js";
import { PlannedPathService } from "./planned-path.service.js";

describe("PlannedPathService", () => {
	const geometry: LineStringGeometry = {
		coordinates: [
			[30.5234, 50.4501],
			[30.524, 50.451],
		] as Coordinates[],
		type: "LineString",
	};

	const mapboxResponse = {
		internalId: "internal-id",
		route: {
			distance: 1.23,
			duration: 4.56,
			geometry,
		},
	};

	it("create should persist planned route and return dto", async () => {
		const repo: PlannedPathRepository = {
			create: mock.fn((entity: PlannedPathEntity) => entity),
			delete: mock.fn(),
			findById: mock.fn(),
		} as unknown as PlannedPathRepository;

		const service = new PlannedPathService(repo);

		const result = await service.create(mapboxResponse);

		assert.deepStrictEqual(result, {
			distance: 1.23,
			duration: 4.56,
			geometry,
			id: null,
		});
	});

	it("findById should throw when not found", async () => {
		const repo: PlannedPathRepository = {
			create: mock.fn(),
			delete: mock.fn(),
			findById: mock.fn(() => null),
		} as unknown as PlannedPathRepository;

		const service = new PlannedPathService(repo);

		await assert.rejects(
			async () => {
				await service.findById(999);
			},
			{
				message: PlannedPathExceptionMessage.PLANNED_PATH_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			},
		);
	});
});
