import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type UserAuthResponseDto } from "~/modules/users/users.js";

import {
	type UserRouteDeleteParameters,
	type UserRouteFinishRequestDto,
	type UserRouteGetAllQueryRequestDto,
	type UserRouteQueryRequestDto,
	type UserRouteResponseDto,
} from "./libs/types/types.js";
import { UserRouteController } from "./user-route.controller.js";
import { type UserRouteService } from "./user-route.service.js";

describe("UserRouteController", () => {
	const mockUserRouteResponse: UserRouteResponseDto = {
		actualGeometry: {
			coordinates: [
				[30.528_909, 50.455_232],
				[30.528_209, 50.415_232],
			],
			type: "LineString",
		},
		completedAt: null,
		distance: 1000,
		id: 1,
		plannedGeometry: {
			coordinates: [
				[30.528_909, 50.455_232],
				[30.528_209, 50.415_232],
			],
			type: "LineString",
		},
		reviewComment: "comment",
		routeId: 7,
		routeName: "Landscape alley",
		startedAt: null,
		status: "not_started",
		userId: 1,
	};

	const mockActiveUserRoute: UserRouteResponseDto = {
		...mockUserRouteResponse,
		id: 2,
		startedAt: "2025-08-21T16:37:51.437Z",
		status: "active",
	};

	const mockCompletedUserRoute: UserRouteResponseDto = {
		...mockUserRouteResponse,
		completedAt: "2025-08-21T16:38:11.183Z",
		id: 3,
		startedAt: "2025-08-21T16:37:51.437Z",
		status: "completed",
	};

	const mockLogger: Logger = {
		debug: () => {},
		error: () => {},
		info: () => {},
		warn: () => {},
	};

	const mockUserRouteService = {
		create: () => Promise.resolve(mockUserRouteResponse),
		deleteSavedRoute: () => Promise.resolve(true),
		finish: () => Promise.resolve(mockCompletedUserRoute),
		getAll: () =>
			Promise.resolve([
				mockUserRouteResponse,
				mockActiveUserRoute,
				mockCompletedUserRoute,
			]),
		getOne: () => Promise.resolve(mockUserRouteResponse),
		start: () => Promise.resolve(mockActiveUserRoute),
	} as unknown as UserRouteService;

	const userRouteController = new UserRouteController(
		mockLogger,
		mockUserRouteService,
	);

	describe("create", () => {
		it("should create a new user route and return 201 status", async () => {
			const options: APIHandlerOptions<{
				query: UserRouteQueryRequestDto;
			}> = {
				query: { routeId: 7 },
				user: { id: 1 },
			} as APIHandlerOptions<{
				query: UserRouteQueryRequestDto;
			}>;

			const result = await userRouteController.create(options);

			assert.strictEqual(result.status, HTTPCode.CREATED);
			assert.deepStrictEqual(result.payload.data, mockUserRouteResponse);
			assert.strictEqual(result.payload.data.status, "not_started");
			assert.strictEqual(result.payload.data.startedAt, null);
			assert.strictEqual(result.payload.data.completedAt, null);
		});
	});

	describe("start", () => {
		it("should start a user route and return 200 status with active status", async () => {
			const options: APIHandlerOptions<{
				query: UserRouteQueryRequestDto;
			}> = {
				query: { routeId: 7 },
				user: { id: 1 },
			} as APIHandlerOptions<{
				query: UserRouteQueryRequestDto;
			}>;

			const result = await userRouteController.start(options);

			assert.strictEqual(result.status, HTTPCode.OK);
			assert.deepStrictEqual(result.payload.data, mockActiveUserRoute);
			assert.strictEqual(result.payload.data.status, "active");
			assert.strictEqual(
				result.payload.data.startedAt,
				"2025-08-21T16:37:51.437Z",
			);
			assert.strictEqual(result.payload.data.completedAt, null);
		});
	});

	describe("finish", () => {
		it("should finish a user route and return 200 status with completed status", async () => {
			const finishRequest: UserRouteFinishRequestDto = {
				actualGeometry: {
					coordinates: [
						[30.528_909, 50.455_232],
						[30.528_209, 50.415_232],
					],
					type: "LineString",
				},
			};

			const options: APIHandlerOptions<{
				body: UserRouteFinishRequestDto;
				query: UserRouteQueryRequestDto;
			}> = {
				body: finishRequest,
				query: { routeId: 7 },
				user: { id: 1 },
			} as APIHandlerOptions<{
				body: UserRouteFinishRequestDto;
				query: { routeId: number };
			}>;

			const result = await userRouteController.finish(options);

			assert.strictEqual(result.status, HTTPCode.OK);
			assert.deepStrictEqual(result.payload.data, mockCompletedUserRoute);
			assert.strictEqual(result.payload.data.status, "completed");
			assert.strictEqual(
				result.payload.data.startedAt,
				"2025-08-21T16:37:51.437Z",
			);
			assert.strictEqual(
				result.payload.data.completedAt,
				"2025-08-21T16:38:11.183Z",
			);
		});
	});

	describe("getAll", () => {
		it("should get all user routes and return 200 status with array of routes", async () => {
			const options: APIHandlerOptions<{
				query: UserRouteGetAllQueryRequestDto;
				user: UserAuthResponseDto;
			}> = {
				body: undefined,
				params: undefined,
				query: { status: "active" },
				user: {
					avatarUrl: null,
					email: "",
					firstName: "",
					group: { id: 1, key: "admins", name: "Test Group", permissions: [] },
					groupId: 1,
					id: 1,
					isVisibleProfile: true,
					lastName: "",
				},
			};

			const result = await userRouteController.getAll(options);

			assert.strictEqual(result.status, HTTPCode.OK);
			assert.strictEqual(Array.isArray(result.payload.data), true);
			assert.strictEqual(result.payload.data.length, 3);

			const [notStartedRoute, activeRoute, completedRoute] = result.payload
				.data as [
				UserRouteResponseDto,
				UserRouteResponseDto,
				UserRouteResponseDto,
			];

			assert.strictEqual(notStartedRoute.status, "not_started");
			assert.strictEqual(notStartedRoute.startedAt, null);
			assert.strictEqual(notStartedRoute.completedAt, null);

			assert.strictEqual(activeRoute.status, "active");
			assert.strictEqual(activeRoute.startedAt, "2025-08-21T16:37:51.437Z");
			assert.strictEqual(activeRoute.completedAt, null);

			assert.strictEqual(completedRoute.status, "completed");
			assert.strictEqual(completedRoute.startedAt, "2025-08-21T16:37:51.437Z");
			assert.strictEqual(
				completedRoute.completedAt,
				"2025-08-21T16:38:11.183Z",
			);
		});
	});

	describe("getByRouteId", () => {
		it("should get user route by route ID and return 200 status", async () => {
			const options: APIHandlerOptions<{
				query: UserRouteQueryRequestDto;
			}> = {
				query: { routeId: 7 },
				user: { id: 1 },
			} as APIHandlerOptions<{
				query: UserRouteQueryRequestDto;
			}>;

			const result = await userRouteController.getByRouteId(options);

			assert.strictEqual(result.status, HTTPCode.OK);
			assert.deepStrictEqual(result.payload.data, mockUserRouteResponse);
			assert.strictEqual(result.payload.data.routeId, 7);
			assert.strictEqual(result.payload.data.userId, 1);
			assert.strictEqual(result.payload.data.status, "not_started");
		});
	});

	describe("delete", () => {
		it("should delete user route", async () => {
			const parameters: UserRouteDeleteParameters = {
				id: 1,
			};

			const options: APIHandlerOptions<{
				params: UserRouteDeleteParameters;
			}> = {
				params: parameters,
			} as APIHandlerOptions<{
				params: UserRouteDeleteParameters;
			}>;

			const response = await userRouteController.delete(options);

			assert.equal(response.status, HTTPCode.OK);
			assert.equal(response.payload.data, true);
		});
	});
});
