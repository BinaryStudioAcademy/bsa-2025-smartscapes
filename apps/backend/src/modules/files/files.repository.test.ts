import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { FilesEntity } from "./files.entity.js";
import { FilesModel } from "./files.model.js";
import { FilesRepository } from "./files.repository.js";

describe("FilesRepository", () => {
	let filesRepository: FilesRepository;
	let databaseTracker: Tracker;

	const mockFile: Parameters<typeof FilesEntity.initialize>[0] = {
		contentType: "image/jpg",
		createdAt: "2024-01-01T00:00:00Z",
		id: 1,
		updatedAt: "2024-01-01T00:00:00Z",
		url: "https://example.com/file.jpg",
	};

	const createMockEntity = (): FilesEntity => FilesEntity.initialize(mockFile);

	beforeEach(() => {
		const database = knex({ client: MockClient });

		databaseTracker = createTracker(database);

		FilesModel.knex(database);

		filesRepository = new FilesRepository(FilesModel);
	});

	afterEach(() => {
		databaseTracker.reset();
	});

	it("create should create and return new file", async () => {
		const fileEntity = createMockEntity();

		databaseTracker.on.insert(DatabaseTableName.FILES).response([fileEntity]);

		const result = await filesRepository.create(fileEntity);

		assert.deepStrictEqual(result, fileEntity);
	});

	it("findAll should return all files", async () => {
		const fileEntities = [createMockEntity()];

		databaseTracker.on.select(DatabaseTableName.FILES).response(fileEntities);

		const result = await filesRepository.findAll();

		assert.deepStrictEqual(result, fileEntities);
	});
});
