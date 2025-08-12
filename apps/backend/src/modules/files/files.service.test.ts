import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { type AWSService } from "~/libs/modules/aws/aws.js";

import { FilesEntity } from "./files.entity.js";
import { type FilesRepository } from "./files.repository.js";
import { FilesService } from "./files.service.js";
import { type FileContentType } from "./libs/types/types.js";

describe("FilesService", () => {
	const mockFile: Parameters<typeof FilesEntity.initialize>[0] = {
		contentType: "image/jpg" as FileContentType,
		createdAt: "2024-01-01T00:00:00Z",
		id: 1,
		updatedAt: "2024-01-01T00:00:00Z",
		url: "https://example.com/file.jpg",
	};

	const createMockEntity = (): FilesEntity => FilesEntity.initialize(mockFile);

	it("create should return new file", async () => {
		const fileEntity = FilesEntity.initialize(mockFile);

		const filesRepository = {
			create: (() => Promise.resolve(fileEntity)) as FilesRepository["create"],
		} as FilesRepository;

		const awsService = {} as AWSService;
		const filesService = new FilesService(filesRepository, awsService);

		const result = await filesService.create({
			contentType: mockFile.contentType,
			url: mockFile.url,
		});

		assert.deepStrictEqual(result, {
			contentType: mockFile.contentType,
			id: mockFile.id,
			url: mockFile.url,
		});
	});

	it("getAll should return all files", async () => {
		const fileEntity = createMockEntity();

		const filesRepository = {
			findAll: () => Promise.resolve([fileEntity]),
		} as unknown as FilesRepository;

		const awsService = {} as AWSService;
		const filesService = new FilesService(filesRepository, awsService);

		const result = await filesService.getAll();

		assert.deepStrictEqual(result, [fileEntity.toObject()]);
	});

	it("uploadFile should return uploaded file", async () => {
		const fileEntity = createMockEntity();

		const filesRepository = {
			create: (() => Promise.resolve(fileEntity)) as FilesRepository["create"],
		} as FilesRepository;

		const awsService = {
			uploadFile: () => Promise.resolve(mockFile.url),
		} as unknown as AWSService;

		const filesService = new FilesService(filesRepository, awsService);

		const result = await filesService.uploadFile({
			file: {
				filename: "test.jpg",
				mimetype: "image/jpg" as FileContentType,
				toBuffer: () => Promise.resolve(Buffer.from("test")),
			} as unknown as Parameters<typeof filesService.uploadFile>[0]["file"],
			folder: "avatars",
		});

		assert.deepStrictEqual(result, fileEntity.toObject());
	});
});
