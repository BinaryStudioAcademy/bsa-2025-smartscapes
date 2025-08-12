import { type FastifyInstance, type FastifyRequest } from "fastify";
import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { BYTES_IN_MB } from "~/libs/constants/constants.js";
import { FilesError } from "~/modules/files/files.js";

import { multipartPlugin } from "./multipart.plugin.js";

type preHandlerCallback = (request: FastifyRequest) => Promise<unknown>;

const EXPECTED_CALL_COUNT = 1;
const FIRST_ARGUMENT_INDEX = 0;
const SECOND_ARGUMENT_INDEX = 1;
const MAX_FILE_SIZE_MB = 5;
const SIZE_INCREMENT = 1;
const SIZE_EXCEEDING_LIMIT = MAX_FILE_SIZE_MB + SIZE_INCREMENT;

describe("Multipart plugin", () => {
	it("should insert plugin into app", async () => {
		const registerMock = mock.fn();
		const addHookMock = mock.fn();
		const appMock = {
			addHook: addHookMock,
			register: registerMock,
		} as unknown as FastifyInstance;

		await multipartPlugin(appMock, { MAX_FILE_SIZE_MB: 10 });

		assert.equal(registerMock.mock.callCount(), EXPECTED_CALL_COUNT);
		assert.equal(addHookMock.mock.callCount(), EXPECTED_CALL_COUNT);
	});

	it("should add preHandler hook", async () => {
		const addHookMock = mock.fn();
		const appMock = {
			addHook: addHookMock,
			register: async () => {},
		} as unknown as FastifyInstance;

		await multipartPlugin(appMock, { MAX_FILE_SIZE_MB: 10 });

		const callArguments =
			addHookMock.mock.calls[FIRST_ARGUMENT_INDEX]?.arguments;
		const hookName = callArguments?.[FIRST_ARGUMENT_INDEX] as string;
		const hook = callArguments?.[SECOND_ARGUMENT_INDEX] as preHandlerCallback;

		assert.equal(hookName, "preHandler");
		assert.equal(typeof hook, "function");
	});

	it("should skip non-multipart requests", async () => {
		const addHookMock = mock.fn();
		const appMock = {
			addHook: addHookMock,
			register: async () => {},
		} as unknown as FastifyInstance;

		await multipartPlugin(appMock, { MAX_FILE_SIZE_MB: 10 });

		const callArguments =
			addHookMock.mock.calls[FIRST_ARGUMENT_INDEX]?.arguments;
		const hook = callArguments?.[SECOND_ARGUMENT_INDEX] as preHandlerCallback;

		const mockRequest = {
			isMultipart: () => false,
		} as unknown as FastifyRequest;

		assert.doesNotReject(() => hook(mockRequest));
	});

	it("should throw error for missing file", async () => {
		const addHookMock = mock.fn();
		const appMock = {
			addHook: addHookMock,
			register: async () => {},
		} as unknown as FastifyInstance;

		await multipartPlugin(appMock, { MAX_FILE_SIZE_MB: 10 });

		const callArguments =
			addHookMock.mock.calls[FIRST_ARGUMENT_INDEX]?.arguments;
		const hook = callArguments?.[SECOND_ARGUMENT_INDEX] as preHandlerCallback;
		const mockRequest = {
			file: () => null,
			isMultipart: () => true,
		} as unknown as FastifyRequest;

		assert.rejects(() => hook(mockRequest), FilesError);
	});

	it("should throw error for file size exceeding limit", async () => {
		const addHookMock = mock.fn();
		const appMock = {
			addHook: addHookMock,
			register: async () => {},
		} as unknown as FastifyInstance;

		await multipartPlugin(appMock, { MAX_FILE_SIZE_MB });

		const callArguments =
			addHookMock.mock.calls[FIRST_ARGUMENT_INDEX]?.arguments;
		const hook = callArguments?.[SECOND_ARGUMENT_INDEX] as preHandlerCallback;
		const mockFile = {
			file: {
				bytesRead: SIZE_EXCEEDING_LIMIT * BYTES_IN_MB,
			},
			mimetype: "image/jpeg",
		};
		const mockRequest = {
			file: () => mockFile,
			isMultipart: () => true,
		} as unknown as FastifyRequest;

		assert.rejects(() => hook(mockRequest), FilesError);
	});

	it("should throw error for invalid file type", async () => {
		const addHookMock = mock.fn();
		const appMock = {
			addHook: addHookMock,
			register: async () => {},
		} as unknown as FastifyInstance;

		await multipartPlugin(appMock, { MAX_FILE_SIZE_MB: 10 });

		const callArguments =
			addHookMock.mock.calls[FIRST_ARGUMENT_INDEX]?.arguments;
		const hook = callArguments?.[SECOND_ARGUMENT_INDEX] as preHandlerCallback;
		const mockFile = {
			file: {
				bytesRead: BYTES_IN_MB,
			},
			mimetype: "application/exe",
		};
		const mockRequest = {
			file: () => mockFile,
			isMultipart: () => true,
		} as unknown as FastifyRequest;

		assert.rejects(() => hook(mockRequest), FilesError);
	});

	it("should accept valid file", async () => {
		const addHookMock = mock.fn();
		const appMock = {
			addHook: addHookMock,
			register: async () => {},
		} as unknown as FastifyInstance;

		await multipartPlugin(appMock, { MAX_FILE_SIZE_MB: 10 });

		const callArguments =
			addHookMock.mock.calls[FIRST_ARGUMENT_INDEX]?.arguments;
		const hook = callArguments?.[SECOND_ARGUMENT_INDEX] as preHandlerCallback;
		const mockFile = {
			file: {
				bytesRead: BYTES_IN_MB,
			},
			mimetype: "image/jpeg",
		};
		const mockRequest = {
			body: undefined,
			file: () => mockFile,
			isMultipart: () => true,
		} as unknown as FastifyRequest;

		assert.doesNotReject(async () => {
			await hook(mockRequest);
			assert.equal(mockRequest.body, mockFile);
		});
	});
});
