import assert from "node:assert/strict";
import { beforeEach, describe, it, mock } from "node:test";

import { HTTPCode, type HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type APIResponse } from "~/libs/types/types.js";

import { type ServerApplicationRouteParameters } from "../server-application/server-application.js";
import { BaseController } from "./base-controller.module.js";
import {
	type APIHandler,
	type ControllerRouteParameters,
} from "./libs/types/types.js";

describe("BaseController", () => {
	const apiPath = "/api";

	let baseController: BaseController;

	const mockLogger: Logger = {
		debug: () => {},
		error: () => {},
		info: () => {},
		warn: () => {},
	};

	beforeEach(() => {
		baseController = new BaseController(mockLogger, apiPath);
	});

	it("addRoute should register route", () => {
		const routeOptions: ControllerRouteParameters = {
			handler: () =>
				Promise.resolve({
					payload: {
						data: {},
					},
					status: 201,
				}),
			method: "POST",
			path: "/test",
		};

		baseController.addRoute(routeOptions);

		assert.partialDeepStrictEqual(baseController.routes, [
			{
				method: routeOptions.method,
				path: `${apiPath}${routeOptions.path}`,
			},
		]);
	});

	it("should map handler correctly", async () => {
		const responseStatus = HTTPCode.CREATED;
		const responsePayload: APIResponse<{ id: number }> = { data: { id: 1 } };

		const mockRequest = {
			body: { value: 1 },
			id: "1",
			method: "GET",
			params: { id: "123" },
			query: { x: "1" },
			url: "/test/:id",
			user: null,
		} as Parameters<ServerApplicationRouteParameters["handler"]>[0];

		const mockHandler = mock.fn<APIHandler>(() => ({
			payload: responsePayload,
			status: responseStatus,
		}));

		let sentStatus: number = 0;
		let sentPayload: unknown = null;

		const mockReply = {
			status(code: number): { send: (payload: unknown) => void } {
				sentStatus = code;

				return {
					send(payload: unknown): void {
						sentPayload = payload;
					},
				};
			},
		} as Parameters<ServerApplicationRouteParameters["handler"]>[1];

		baseController.addRoute({
			handler: mockHandler,
			method: mockRequest.method as HTTPMethod,
			path: mockRequest.url,
		});

		const [route] = baseController.routes;

		await (route as ServerApplicationRouteParameters).handler(
			mockRequest,
			mockReply,
		);

		const [handlerCall] = mockHandler.mock.calls;
		const [handlerArgument] = handlerCall?.arguments ?? [];

		assert.deepStrictEqual(handlerArgument, {
			body: mockRequest.body,
			params: mockRequest.params,
			query: mockRequest.query,
			user: mockRequest.user,
		});

		assert.strictEqual(sentStatus, responseStatus);
		assert.deepStrictEqual(sentPayload, responsePayload);
	});
});
