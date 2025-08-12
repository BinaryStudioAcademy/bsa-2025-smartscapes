import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { FilesController } from "./files.controller.js";
import { type FilesService } from "./files.service.js";
import { type FileContentType } from "./libs/types/types.js";

describe("FilesController", () => {
	const mockLogger: Logger = {
		debug: () => {},
		error: () => {},
		info: () => {},
		warn: () => {},
	};

	const mockFile = {
		contentType: "image/jpg" as FileContentType,
		id: 1,
		url: "https://example.com/file.jpg",
	};

	it("getAll should return all files", async () => {
		const files = [mockFile];

		const mockGetAll: FilesService["getAll"] = () => {
			return Promise.resolve(files);
		};

		const filesService = {
			getAll: mockGetAll,
		} as FilesService;

		const filesController = new FilesController(mockLogger, filesService);

		const result = await filesController.getAll();

		assert.deepStrictEqual(result, {
			payload: {
				data: files,
			},
			status: HTTPCode.OK,
		});
	});

	it("uploadFile should return uploaded file", async () => {
		const mockUploadFile: FilesService["uploadFile"] = () => {
			return Promise.resolve(mockFile);
		};

		const filesService = {
			uploadFile: mockUploadFile,
		} as FilesService;

		const filesController = new FilesController(mockLogger, filesService);

		const result = await filesController.uploadFile({
			body: {} as unknown as Parameters<
				typeof filesController.uploadFile
			>[0]["body"],
			params: { folder: "avatars" },
			query: {},
			user: null,
		});

		assert.deepStrictEqual(result, {
			payload: {
				data: mockFile,
			},
			status: HTTPCode.CREATED,
		});
	});
});
