import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { FilesEntity } from "./files.entity.js";

const MOCK_FILE_ID = 1;
const MOCK_FILE_URL = "https://example.com/file.jpg";
const MOCK_CONTENT_TYPE = "image/jpg" as const;
const MOCK_CREATED_AT = "2024-01-01T00:00:00Z";
const MOCK_UPDATED_AT = "2024-01-01T00:00:00Z";

describe("FilesEntity", () => {
	describe("initialize", () => {
		it("should initialize entity from existing data", () => {
			const fileData = {
				contentType: MOCK_CONTENT_TYPE,
				createdAt: MOCK_CREATED_AT,
				id: MOCK_FILE_ID,
				updatedAt: MOCK_UPDATED_AT,
				url: MOCK_FILE_URL,
			};

			const entity = FilesEntity.initialize(fileData);

			assert.equal(entity.toObject().id, MOCK_FILE_ID);
			assert.equal(entity.toObject().url, MOCK_FILE_URL);
			assert.equal(entity.toObject().contentType, MOCK_CONTENT_TYPE);
		});
	});

	describe("initializeNew", () => {
		it("should initialize new entity without id", () => {
			const entity = FilesEntity.initializeNew({
				contentType: MOCK_CONTENT_TYPE,
				url: MOCK_FILE_URL,
			});

			assert.equal(entity.toNewObject().url, MOCK_FILE_URL);
			assert.equal(entity.toNewObject().contentType, MOCK_CONTENT_TYPE);
		});
	});

	describe("toNewObject", () => {
		it("should return object without id", () => {
			const entity = FilesEntity.initializeNew({
				contentType: MOCK_CONTENT_TYPE,
				url: MOCK_FILE_URL,
			});

			const newObject = entity.toNewObject();

			assert.equal(newObject.url, MOCK_FILE_URL);
			assert.equal(newObject.contentType, MOCK_CONTENT_TYPE);
			assert.ok(!("id" in newObject));
		});
	});

	describe("toObject", () => {
		it("should return object with id", () => {
			const fileData = {
				contentType: MOCK_CONTENT_TYPE,
				createdAt: MOCK_CREATED_AT,
				id: MOCK_FILE_ID,
				updatedAt: MOCK_UPDATED_AT,
				url: MOCK_FILE_URL,
			};

			const entity = FilesEntity.initialize(fileData);
			const object = entity.toObject();

			assert.equal(object.id, MOCK_FILE_ID);
			assert.equal(object.url, MOCK_FILE_URL);
			assert.equal(object.contentType, MOCK_CONTENT_TYPE);
		});
	});
});
