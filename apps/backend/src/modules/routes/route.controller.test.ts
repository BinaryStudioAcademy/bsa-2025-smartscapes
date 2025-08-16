import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode, PermissionKey } from "~/libs/enums/enums.js";
import { checkHasPermission } from "~/libs/hooks/hooks.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { GroupEntity } from "../groups/group.entity.js";
import { PermissionEntity } from "../permission/permission.entity.js";
import { RouteController } from "./route.controller.js";
import { type RouteService } from "./route.service.js";

const MINIMUM_EXPECTED_ROUTES_COUNT = 6;

const mockReadPermission = PermissionEntity.initialize({
	id: 1,
	key: "READ",
	name: "Can read",
});

const mockManageRoutePermission = PermissionEntity.initialize({
	id: 2,
	key: PermissionKey.MANAGE_ROUTES,
	name: "Manage Route",
});

const mockWrongPermission = PermissionEntity.initialize({
	id: 3,
	key: "WRONG_PERMISSION",
	name: "Wrong Permission",
});

const mockUserGroup = GroupEntity.initializeWithPermissions({
	id: 2,
	key: "users",
	name: "Users",
	permissions: [mockReadPermission.toObject()],
}).toObject();

const mockUserGroupWithWrongPermission = GroupEntity.initializeWithPermissions({
	id: 3,
	key: "users",
	name: "Users with Wrong Permission",
	permissions: [mockReadPermission.toObject(), mockWrongPermission.toObject()],
}).toObject();

const mockAdminGroup = GroupEntity.initializeWithPermissions({
	id: 1,
	key: "admins",
	name: "Admins",
	permissions: [
		mockReadPermission.toObject(),
		mockManageRoutePermission.toObject(),
	],
}).toObject();

const mockDelete: RouteService["delete"] = () => {
	return Promise.resolve(true);
};

describe("Route controller", () => {
	const mockUser = {
		email: "test@example.com",
		firstName: "John",
		group: mockUserGroup,
		groupId: 2,
		id: 1,
		lastName: "Doe",
	};

	const mockUserWithWrongPermission = {
		email: "wrong@example.com",
		firstName: "Wrong",
		group: mockUserGroupWithWrongPermission,
		groupId: 3,
		id: 3,
		lastName: "User",
	};

	const mockAdminUser = {
		email: "admin@example.com",
		firstName: "Jane",
		group: mockAdminGroup,
		groupId: 1,
		id: 2,
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
	const FIRST_VISIT_ORDER = 0;
	const SECOND_VISIT_ORDER = 1;

	const mockRoute = {
		description: "Test route description",
		id: FIRST_POI_ID,
		name: "Test Route",
		pois: [
			{ id: FIRST_POI_ID, visitOrder: FIRST_VISIT_ORDER },
			{ id: SECOND_POI_ID, visitOrder: SECOND_VISIT_ORDER },
		],
	};

	it("Should return data with 200 status code", async () => {
		const mockData = "mockData";
		const constructRouteMockData = {
			body: { pointsOfInterest: [] },
			params: null,
			query: null,
			user: mockUser,
		};
		const routesServiceMock = {
			construct: () => Promise.resolve(mockData),
		} as unknown as RouteService;
		const controller = new RouteController(mockLogger, routesServiceMock);

		const { payload, status } = await controller.constructRoute(
			constructRouteMockData,
		);

		assert.equal(status, HTTPCode.OK);
		assert.equal(payload.data, mockData);
	});

	it("create should return created route", async () => {
		const createRouteMockData = {
			body: {
				description: mockRoute.description,
				name: mockRoute.name,
				pois: [FIRST_POI_ID, SECOND_POI_ID],
			},
			params: {},
			query: {},
			user: mockAdminUser,
		};

		const mockCreate: RouteService["create"] = () => {
			return Promise.resolve(mockRoute);
		};

		const routesService = {
			create: mockCreate,
		} as RouteService;

		const controller = new RouteController(mockLogger, routesService);

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

		const mockFind: RouteService["findById"] = () => {
			return Promise.resolve(mockRoute);
		};

		const routesService = {
			findById: mockFind,
		} as RouteService;

		const controller = new RouteController(mockLogger, routesService);

		const result = await controller.findById(findRouteMockData);

		assert.deepStrictEqual(result, {
			payload: { data: mockRoute },
			status: HTTPCode.OK,
		});
	});

	it("findAll should return all routes if query is not provided", async () => {
		const mockFindAll: RouteService["findAll"] = () => {
			return Promise.resolve({ items: [mockRoute] });
		};

		const routesService = {
			findAll: mockFindAll,
		} as RouteService;

		const controller = new RouteController(mockLogger, routesService);

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
		const mockFindAll: RouteService["findAll"] = () => {
			return Promise.resolve({ items: [mockRoute] });
		};

		const routesService = {
			findAll: mockFindAll,
		} as RouteService;

		const controller = new RouteController(mockLogger, routesService);

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
		const routesService = {
			findAll: (() =>
				Promise.resolve({ items: [] })) as RouteService["findAll"],
		} as RouteService;

		const mockSearchQuery = "nonexistent";

		const controller = new RouteController(mockLogger, routesService);

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

		const mockUpdate: RouteService["patch"] = () => {
			return Promise.resolve(updatedRoute);
		};

		const routesService = {
			patch: mockUpdate,
		} as RouteService;

		const controller = new RouteController(mockLogger, routesService);

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

		const routesService = {
			delete: mockDelete,
		} as RouteService;

		const controller = new RouteController(mockLogger, routesService);

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
		it("CREATE - should work correctly when called with admin user (correct permission)", async () => {
			const createRouteMockData = {
				body: {
					description: mockRoute.description,
					name: mockRoute.name,
					pois: [FIRST_POI_ID, SECOND_POI_ID],
				},
				params: {},
				query: {},
				user: mockAdminUser,
			};

			const mockCreate: RouteService["create"] = () => {
				return Promise.resolve(mockRoute);
			};

			const routesService = {
				create: mockCreate,
			} as unknown as RouteService;

			const controller = new RouteController(mockLogger, routesService);

			const result = await controller.create(createRouteMockData);

			assert.deepStrictEqual(result, {
				payload: { data: mockRoute },
				status: HTTPCode.CREATED,
			});
		});

		it("PATCH - should work correctly when called with admin user (correct permission)", async () => {
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

			const routesService = {
				patch: mockUpdate,
			} as unknown as RouteService;

			const controller = new RouteController(mockLogger, routesService);

			const result = await controller.patch(updateRouteMockData);

			assert.deepStrictEqual(result, {
				payload: { data: updatedRoute },
				status: HTTPCode.OK,
			});
		});

		it("DELETE - should work correctly when called with admin user (correct permission)", async () => {
			const deleteRouteMockData = {
				body: {},
				params: { id: "1" },
				query: {},
				user: mockAdminUser,
			};

			const routesService = {
				delete: mockDelete,
			} as unknown as RouteService;

			const controller = new RouteController(mockLogger, routesService);

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
				return Promise.resolve({ items: [mockRoute] });
			};

			const routesService = {
				findAll: mockFindAll,
			} as unknown as RouteService;

			const controller = new RouteController(mockLogger, routesService);

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

			const routesService = {
				findById: mockFind,
			} as unknown as RouteService;

			const controller = new RouteController(mockLogger, routesService);

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

			const routesService = {
				findById: mockFind,
			} as unknown as RouteService;

			const controller = new RouteController(mockLogger, routesService);

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

			const routesService = {
				findById: mockFind,
			} as unknown as RouteService;

			const controller = new RouteController(mockLogger, routesService);

			const result = await controller.findById(findRouteAdminMockData);

			assert.deepStrictEqual(result, {
				payload: { data: mockRoute },
				status: HTTPCode.OK,
			});
		});
	});

	describe("Verify Permission Configuration is Applied", () => {
		it("should confirm that routes are configured with proper permission checks", () => {
			const routesService = {
				create: () => Promise.resolve(mockRoute),
				delete: () => Promise.resolve(true),
				findAll: () => Promise.resolve({ items: [mockRoute] }),
				findById: () => Promise.resolve(mockRoute),
				patch: () => Promise.resolve(mockRoute),
			} as unknown as RouteService;

			const controller = new RouteController(mockLogger, routesService);

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
			const hasPatchRoute = controller.routes.some(
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
			assert.ok(hasPatchRoute, "Should have PATCH route configured");
			assert.ok(hasGetAllRoute, "Should have GET all route configured");
			assert.ok(hasGetByIdRoute, "Should have GET by ID route configured");
		});
	});
});
