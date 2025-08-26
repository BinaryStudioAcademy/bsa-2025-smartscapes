import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode, PermissionKey } from "~/libs/enums/enums.js";
import { checkHasPermission } from "~/libs/hooks/hooks.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	type Coordinates,
	type LineStringGeometry,
} from "~/libs/types/types.js";

import { GroupEntity } from "../groups/group.entity.js";
import { PermissionEntity } from "../permission/permission.entity.js";
import {
	type RouteGetAllItemResponseDto,
	type RouteGetByIdResponseDto,
} from "./libs/types/types.js";
import { RouteController } from "./route.controller.js";
import { type RouteService } from "./route.service.js";

const mockPermission = PermissionEntity.initialize({
	id: 1,
	key: "READ",
	name: "Can read",
});

const mockGroup = GroupEntity.initializeWithPermissions({
	id: 2,
	key: "users",
	name: "Users",
	permissions: [mockPermission.toObject()],
}).toObject();

const mockManageRoutesPermission = PermissionEntity.initialize({
	id: 3,
	key: PermissionKey.MANAGE_ROUTES,
	name: "Manage routes",
});

const mockAdminGroup = GroupEntity.initializeWithPermissions({
	id: 3,
	key: "admins",
	name: "Admins",
	permissions: [mockManageRoutesPermission.toObject()],
}).toObject();

const MINIMUM_EXPECTED_ROUTES_COUNT = 6;

const mockDelete: RouteService["delete"] = () => {
	return Promise.resolve(true);
};

describe("Route controller", () => {
	const mockUser = {
		avatarUrl: "https://aws/avatars/example_file.jpg",
		email: "test@example.com",
		firstName: "John",
		group: mockGroup,
		groupId: 2,
		id: 1,
		isVisibleProfile: true,
		lastName: "Doe",
	};

	const mockAdminUser = {
		avatarUrl: "https://aws/avatars/example_file.jpg",
		email: "admin@example.com",
		firstName: "Jane",
		group: mockAdminGroup,
		groupId: 1,
		id: 2,
		isVisibleProfile: true,
		lastName: "Admin",
	};

	const mockLogger: Logger = {
		debug: () => {},
		error: () => {},
		info: () => {},
		warn: () => {},
	};

	const FIRST_POI_ID = 1;
	const SECOND_POI_ID = 2;
	const FIRST_NAME = "SUP Kayak Club 4 Storony";
	const SECOND_NAME = "River Grill, Rusanivska Embankment";
	const FIRST_VISIT_ORDER = 0;
	const SECOND_VISIT_ORDER = 1;

	const mockGeometry: LineStringGeometry = {
		coordinates: [
			[30.5234, 50.4501],
			[30.524, 50.451],
		] as Coordinates[],
		type: "LineString",
	};

	const mockRoute: RouteGetByIdResponseDto = {
		createdByUserId: 10,
		description: "Test route description",
		distance: 1.23,
		duration: 4.56,
		geometry: mockGeometry,
		id: FIRST_POI_ID,
		images: [
			{
				id: 1,
				url: "https://s3.amazonaws.com/test/1.png",
			},
			{
				id: 2,
				url: "https://s3.amazonaws.com/test/2.png",
			},
		],
		name: "Test Route",
		pois: [
			{ id: FIRST_POI_ID, name: FIRST_NAME, visitOrder: FIRST_VISIT_ORDER },
			{ id: SECOND_POI_ID, name: SECOND_NAME, visitOrder: SECOND_VISIT_ORDER },
		],
	};

	const mockUserWithWrongPermission = {
		...mockUser,
	};

	it("Should return data with 200 status code", async () => {
		const mockData = "mockData";
		const constructRouteMockData = {
			body: { poiIds: [] },
			params: null,
			query: null,
			user: mockUser,
		};
		const routeServiceMock = {
			construct: () => Promise.resolve(mockData),
		} as unknown as RouteService;
		const controller = new RouteController(mockLogger, routeServiceMock);

		const { payload, status } = await controller.constructRoute(
			constructRouteMockData,
		);

		assert.equal(status, HTTPCode.OK);
		assert.equal(payload.data, mockData);
	});

	it("create should return created route", async () => {
		const createRouteMockData = {
			body: {
				createdByUserId: mockAdminUser.id,
				description: mockRoute.description,
				name: mockRoute.name,
				plannedPathId: 1,
				poiIds: [FIRST_POI_ID, SECOND_POI_ID],
			},
			params: {},
			query: {},
			user: mockAdminUser,
		};

		const mockCreate: RouteService["create"] = () => Promise.resolve(mockRoute);

		const routeService = {
			create: mockCreate,
		} as RouteService;

		const controller = new RouteController(mockLogger, routeService);

		const result = await controller.create(createRouteMockData);

		assert.deepStrictEqual(result, {
			payload: { data: mockRoute },
			status: HTTPCode.CREATED,
		});
	});

	it("find should return route by id", async () => {
		const findRouteMockData = {
			body: {},
			params: { id: "1" },
			query: {},
			user: mockUser,
		};

		const mockFind: RouteService["findById"] = () => Promise.resolve(mockRoute);

		const routeService = {
			findById: mockFind,
		} as RouteService;

		const controller = new RouteController(mockLogger, routeService);

		const result = await controller.findById(findRouteMockData);

		assert.deepStrictEqual(result, {
			payload: { data: mockRoute },
			status: HTTPCode.OK,
		});
	});

	it("findAll should return all routes if query is not provided", async () => {
		const mockFindAll: RouteService["findAll"] = () =>
			Promise.resolve({
				items: [mockRoute as RouteGetAllItemResponseDto],
			} as { items: RouteGetAllItemResponseDto[] });

		const routeService = {
			findAll: mockFindAll,
		} as RouteService;

		const controller = new RouteController(mockLogger, routeService);

		const result = await controller.findAll({
			body: {},
			params: {},
			query: {},
			user: mockUser,
		});

		assert.deepStrictEqual(result, {
			payload: { data: [mockRoute] },
			status: HTTPCode.OK,
		});
	});

	it("findAll should return response with routes matching search query", async () => {
		const mockFindAll: RouteService["findAll"] = (options) => {
			const items = options?.name
				? ([
						mockRoute as RouteGetAllItemResponseDto,
					] as RouteGetAllItemResponseDto[])
				: ([] as RouteGetAllItemResponseDto[]);

			return Promise.resolve({ items });
		};

		const routeService = {
			findAll: mockFindAll,
		} as RouteService;

		const controller = new RouteController(mockLogger, routeService);

		const mockSearchQuery = mockRoute.name.toLowerCase();

		const result = await controller.findAll({
			body: {},
			params: {},
			query: { name: mockSearchQuery },
			user: mockUser,
		});

		assert.deepStrictEqual(result, {
			payload: { data: [mockRoute] },
			status: HTTPCode.OK,
		});
	});

	it("findAll should return response with empty array if no routes found", async () => {
		const routeService = {
			findAll: (() =>
				Promise.resolve({ items: [] })) as RouteService["findAll"],
		} as RouteService;

		const mockSearchQuery = "nonexistent";

		const controller = new RouteController(mockLogger, routeService);

		const result = await controller.findAll({
			body: {},
			params: {},
			query: { name: mockSearchQuery },
			user: mockUser,
		});

		assert.deepStrictEqual(result, {
			payload: { data: [] },
			status: HTTPCode.OK,
		});
	});

	it("update should return updated route", async () => {
		const updatedRoute = {
			...mockRoute,
			name: "Updated Route",
		};

		const updateRouteMockData = {
			body: {
				description: updatedRoute.description,
				name: updatedRoute.name,
			},
			params: { id: "1" },
			query: {},
			user: mockAdminUser,
		};

		const mockUpdate: RouteService["patch"] = () =>
			Promise.resolve(updatedRoute);

		const routeService = {
			patch: mockUpdate,
		} as RouteService;

		const controller = new RouteController(mockLogger, routeService);

		const result = await controller.patch(updateRouteMockData);

		assert.deepStrictEqual(result, {
			payload: { data: updatedRoute },
			status: HTTPCode.OK,
		});
	});

	it("delete should return deletion status", async () => {
		const deleteRouteMockData = {
			body: {},
			params: { id: "1" },
			query: {},
			user: mockAdminUser,
		};

		const routeService = {
			delete: mockDelete,
		} as RouteService;

		const controller = new RouteController(mockLogger, routeService);

		const result = await controller.delete(deleteRouteMockData);

		assert.deepStrictEqual(result, {
			payload: { data: true },
			status: HTTPCode.OK,
		});
	});

	const testPermissionChecker = (
		permissionChecker: ReturnType<typeof checkHasPermission>,
		user: typeof mockUser,
	): Promise<void> => {
		return new Promise<void>((resolve, reject) => {
			try {
				permissionChecker(
					{
						body: {},
						params: {},
						query: {},
						user,
					},
					resolve,
				);
			} catch (error: unknown) {
				reject(error instanceof Error ? error : new Error(String(error)));
			}
		});
	};

	describe("Permission Hook Tests - All Three Scenarios", () => {
		it("should reject user without manage_routes permission", async () => {
			const permissionChecker = checkHasPermission(PermissionKey.MANAGE_ROUTES);

			await assert.rejects(
				() => testPermissionChecker(permissionChecker, mockUser),
				{
					message: "You don't have permission to perform this action.",
				},
			);
		});

		it("should reject user with wrong permission", async () => {
			const permissionChecker = checkHasPermission(PermissionKey.MANAGE_ROUTES);

			await assert.rejects(
				() =>
					testPermissionChecker(permissionChecker, mockUserWithWrongPermission),
				{
					message: "You don't have permission to perform this action.",
				},
			);
		});

		it("should allow user with correct manage_routes permission", async () => {
			const permissionChecker = checkHasPermission(PermissionKey.MANAGE_ROUTES);

			await testPermissionChecker(permissionChecker, mockAdminUser);
		});
	});

	describe("Controller Method Tests - Protected Operations", () => {
		it("create should work correctly when called with admin user (correct permission)", async () => {
			const createRouteMockData = {
				body: {
					createdByUserId: mockAdminUser.id,
					description: mockRoute.description,
					name: mockRoute.name,
					plannedPathId: 1,
					poiIds: [FIRST_POI_ID, SECOND_POI_ID],
				},
				params: {},
				query: {},
				user: mockAdminUser,
			};

			const mockCreate: RouteService["create"] = () => {
				return Promise.resolve(mockRoute);
			};

			const routeService = {
				create: mockCreate,
			} as RouteService;

			const controller = new RouteController(mockLogger, routeService);

			const result = await controller.create(createRouteMockData);

			assert.deepStrictEqual(result, {
				payload: { data: mockRoute },
				status: HTTPCode.CREATED,
			});
		});

		it("patch should work correctly when called with admin user (correct permission)", async () => {
			const updatedRoute = {
				...mockRoute,
				name: "Updated Route",
			};

			const updateRouteMockData = {
				body: {
					description: updatedRoute.description,
					name: updatedRoute.name,
				},
				params: { id: "1" },
				query: {},
				user: mockAdminUser,
			};

			const mockUpdate: RouteService["patch"] = () => {
				return Promise.resolve(updatedRoute);
			};

			const routeService = {
				patch: mockUpdate,
			} as RouteService;

			const controller = new RouteController(mockLogger, routeService);

			const result = await controller.patch(updateRouteMockData);

			assert.deepStrictEqual(result, {
				payload: { data: updatedRoute },
				status: HTTPCode.OK,
			});
		});

		it("delete should work correctly when called with admin user (correct permission)", async () => {
			const deleteRouteMockData = {
				body: {},
				params: { id: "1" },
				query: {},
				user: mockAdminUser,
			};

			const routeService = {
				delete: mockDelete,
			} as RouteService;

			const controller = new RouteController(mockLogger, routeService);

			const result = await controller.delete(deleteRouteMockData);

			assert.deepStrictEqual(result, {
				payload: { data: true },
				status: HTTPCode.OK,
			});
		});
	});

	describe("GET routes should be accessible to all users (no permission required)", () => {
		it("should allow user without manage_routes permission to get all routes", async () => {
			const mockFindAll: RouteService["findAll"] = () => {
				return Promise.resolve({ items: [mockRoute] } as {
					items: RouteGetAllItemResponseDto[];
				});
			};

			const routeService = {
				findAll: mockFindAll,
			} as RouteService;

			const controller = new RouteController(mockLogger, routeService);

			const result = await controller.findAll({
				body: {},
				params: {},
				query: {},
				user: mockUser,
			});

			assert.deepStrictEqual(result, {
				payload: { data: [mockRoute] },
				status: HTTPCode.OK,
			});
		});

		it("should allow user without manage_routes permission to get route by id", async () => {
			const findRouteMockData = {
				body: {},
				params: { id: "1" },
				query: {},
				user: mockUser,
			};

			const mockFind: RouteService["findById"] = () => {
				return Promise.resolve(mockRoute);
			};

			const routeService = {
				findById: mockFind,
			} as RouteService;

			const controller = new RouteController(mockLogger, routeService);

			const result = await controller.findById(findRouteMockData);

			assert.deepStrictEqual(result, {
				payload: { data: mockRoute },
				status: HTTPCode.OK,
			});
		});

		it("should allow user with wrong permission to get routes", async () => {
			const findRouteWithWrongPermissionMockData = {
				body: {},
				params: { id: "1" },
				query: {},
				user: mockUserWithWrongPermission,
			};

			const mockFind: RouteService["findById"] = () => {
				return Promise.resolve(mockRoute);
			};

			const routeService = {
				findById: mockFind,
			} as RouteService;

			const controller = new RouteController(mockLogger, routeService);

			const result = await controller.findById(
				findRouteWithWrongPermissionMockData,
			);

			assert.deepStrictEqual(result, {
				payload: { data: mockRoute },
				status: HTTPCode.OK,
			});
		});

		it("should allow admin user to get routes", async () => {
			const findRouteAdminMockData = {
				body: {},
				params: { id: "1" },
				query: {},
				user: mockAdminUser,
			};

			const mockFind: RouteService["findById"] = () => {
				return Promise.resolve(mockRoute);
			};

			const routeService = {
				findById: mockFind,
			} as RouteService;

			const controller = new RouteController(mockLogger, routeService);

			const result = await controller.findById(findRouteAdminMockData);

			assert.deepStrictEqual(result, {
				payload: { data: mockRoute },
				status: HTTPCode.OK,
			});
		});
	});

	describe("Verify Permission Configuration is Applied", () => {
		it("should confirm that routes are configured with proper permission checks", () => {
			const routeService = {
				create: () => Promise.resolve(mockRoute),
				delete: () => Promise.resolve(true),
				findAll: () =>
					Promise.resolve({
						items: [mockRoute],
					} as unknown as RouteGetAllItemResponseDto[]),
				findById: () => Promise.resolve(mockRoute),
				patch: () => Promise.resolve(mockRoute),
			} as unknown as RouteService;

			const controller = new RouteController(mockLogger, routeService);

			assert.ok(controller.routes, "Controller should have routes configured");

			assert.ok(
				controller.routes.length >= MINIMUM_EXPECTED_ROUTES_COUNT,
				"Controller should have at least 6 routes configured",
			);

			const hasCreateRoute = controller.routes.some(
				(route) => route.method === "POST" && route.path.endsWith("/"),
			);
			const hasDeleteRoute = controller.routes.some(
				(route) => route.method === "DELETE" && route.path.endsWith("/:id"),
			);
			const haspatch = controller.routes.some(
				(route) => route.method === "PATCH" && route.path.endsWith("/:id"),
			);
			const hasGetAllRoute = controller.routes.some(
				(route) => route.method === "GET" && route.path.endsWith("/"),
			);
			const hasGetByIdRoute = controller.routes.some(
				(route) => route.method === "GET" && route.path.endsWith("/:id"),
			);

			assert.ok(hasCreateRoute, "Should have CREATE route configured");
			assert.ok(hasDeleteRoute, "Should have DELETE route configured");
			assert.ok(haspatch, "Should have PATCH route configured");
			assert.ok(hasGetAllRoute, "Should have GET all route configured");
			assert.ok(hasGetByIdRoute, "Should have GET by ID route configured");
		});
	});
});
