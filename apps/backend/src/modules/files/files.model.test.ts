import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DatabaseTableName } from "~/libs/modules/database/database.js";

import { FilesModel } from "./files.model.js";

describe("FilesModel", () => {
	describe("tableName", () => {
		it("should return correct table name", () => {
			assert.equal(FilesModel.tableName, DatabaseTableName.FILES);
		});
	});

	describe("properties", () => {
		it("should have required properties", () => {
			const model = new FilesModel();

			assert.ok("contentType" in model);
			assert.ok("url" in model);
		});
	});
});
