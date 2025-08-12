import { type FastifyInstance, type FastifyRequest } from "fastify";
import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { AuthError } from "~/modules/auth/libs/exceptions/exceptions.js";

import { authPlugin, type PluginOptions } from "./auth.plugin.js";

type onRequestCallback = (request: FastifyRequest) => Promise<unknown>;

describe("Auth plugin", () => {
	it("should insert plugin into app", () => {
		const decorateRequestMock = mock.fn();
		const addHookMock = mock.fn();
		const appMock = {
			addHook: addHookMock,
			decorateRequest: decorateRequestMock,
		} as unknown as FastifyInstance;

		authPlugin(appMock, {} as PluginOptions, () => {});

		const callCount = 1;

		assert.equal(decorateRequestMock.mock.callCount(), callCount);
		assert.equal(addHookMock.mock.callCount(), callCount);
	});

	it("should set null as default user value", () => {
		const decorateRequestMock = mock.fn();

		const appMock = {
			addHook: () => {},
			decorateRequest: decorateRequestMock,
		} as unknown as FastifyInstance;

		authPlugin(appMock, {} as PluginOptions, () => {});

		const [property, value] = (decorateRequestMock.mock.calls[0]?.arguments ??
			[]) as [unknown, unknown];

		assert.equal(property, "user");
		assert.equal(value, null);
	});

	it("should throw unauthorized error for invalid authorization header", () => {
		const addHookMock = mock.fn();

		const appMock = {
			addHook: addHookMock,
			decorateRequest: () => {},
		} as unknown as FastifyInstance;

		authPlugin(
			appMock,
			{ whiteRoutes: [{ "method": "POST", path: "/" }] } as PluginOptions,
			() => {},
		);

		const [, hook] = (addHookMock.mock.calls[0]?.arguments ?? []) as [
			unknown,
			onRequestCallback,
		];

		const mockRequest = {
			headers: {},
			method: "GET",
			url: "/api/v1/users",
		} as FastifyRequest;

		assert.equal(typeof hook, "function");
		assert.rejects(() => hook(mockRequest), AuthError);
	});

	it("should skip white routes", () => {
		const addHookMock = mock.fn();

		const appMock = {
			addHook: addHookMock,
			decorateRequest: () => {},
		} as unknown as FastifyInstance;

		authPlugin(
			appMock,
			{ whiteRoutes: [{ "method": "GET", path: "/" }] } as PluginOptions,
			() => {},
		);

		const [, hook] = (addHookMock.mock.calls[0]?.arguments ?? []) as [
			unknown,
			onRequestCallback,
		];

		const mockRequest = {
			headers: {},
			method: "GET",
			url: "/",
		} as FastifyRequest;

		assert.doesNotReject(() => hook(mockRequest));
	});

	it("should skip white routes with root basis", () => {
		const addHookMock = mock.fn();
		const appMock = {
			addHook: addHookMock,
			decorateRequest: () => {},
		} as unknown as FastifyInstance;

		authPlugin(
			appMock,
			{
				whiteRoutes: [{ "method": "GET", path: "/test/*" }],
			} as PluginOptions,
			() => {},
		);

		const [, hook] = (addHookMock.mock.calls[0]?.arguments ?? []) as [
			unknown,
			onRequestCallback,
		];

		const mockRequest = {
			headers: {},
			method: "GET",
			url: "/test/something",
		} as FastifyRequest;

		assert.doesNotReject(() => hook(mockRequest));
	});
});
