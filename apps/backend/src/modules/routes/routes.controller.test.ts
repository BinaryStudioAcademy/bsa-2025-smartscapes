import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode } from "~/libs/enums/enums.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { GroupEntity } from "../groups/group.entity.js";
import { PermissionEntity } from "../permission/permission.entity.js";
import { RoutesController } from "./routes.controller.js";
import { type RoutesService } from "./routes.service.js";

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

const mockDelete: RoutesService["delete"] = () => {
	return Promise.resolve(true);
};

describe("Routes controller", () => {
	const mockUser = {
		email: "test@example.com",
		firstName: "John",
		group: mockGroup,
		groupId: 2,
		id: 1,
		lastName: "Doe",
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
		} as unknown as RoutesService;
		const controller = new RoutesController(mockLogger, routesServiceMock);

		const { payload, status } = await controller.constructRoute(
			constructRouteMockData,
		);

		assert.equal(status, HTTPCode.OK);
		assert.equal(payload.data, mockData);
	});

	it("create should return created route", async () => {
		const mockCreate: RoutesService["create"] = () => {
			return Promise.resolve(mockRoute);
		};

		const routesService = {
			create: mockCreate,
		} as RoutesService;

		const controller = new RoutesController(mockLogger, routesService);

		const result = await controller.create({
			body: {
				description: mockRoute.description,
				name: mockRoute.name,
				pois: [FIRST_POI_ID, SECOND_POI_ID],
			},
			params: {},
			query: {},
			user: mockUser,
		});

		assert.deepStrictEqual(result, {
			payload: { data: mockRoute },
			status: HTTPCode.OK,
		});
	});

	it("find should return route by id", async () => {
		const mockFind: RoutesService["findById"] = () => {
			return Promise.resolve(mockRoute);
		};

		const routesService = {
			findById: mockFind,
		} as RoutesService;

		const controller = new RoutesController(mockLogger, routesService);

		const result = await controller.find({
			body: {},
			params: { id: "1" },
			query: {},
			user: mockUser,
		});

		assert.deepStrictEqual(result, {
			payload: { data: mockRoute },
			status: HTTPCode.OK,
		});
	});

	it("findAll should return all routes", async () => {
		const mockFindAll: RoutesService["findAll"] = () => {
			return Promise.resolve({ items: [mockRoute] });
		};

		const routesService = {
			findAll: mockFindAll,
		} as RoutesService;

		const controller = new RoutesController(mockLogger, routesService);

		const result = await controller.findAll();

		assert.deepStrictEqual(result, {
			payload: { data: [mockRoute] },
			status: HTTPCode.OK,
		});
	});

	it("update should return updated route", async () => {
		const updatedRoute = {
			...mockRoute,
			name: "Updated Route",
		};

		const mockUpdate: RoutesService["patch"] = () => {
			return Promise.resolve(updatedRoute);
		};

		const routesService = {
			patch: mockUpdate,
		} as RoutesService;

		const controller = new RoutesController(mockLogger, routesService);

		const result = await controller.patch({
			body: {
				description: updatedRoute.description,
				name: updatedRoute.name,
			},
			params: { id: "1" },
			query: {},
			user: mockUser,
		});

		assert.deepStrictEqual(result, {
			payload: { data: updatedRoute },
			status: HTTPCode.OK,
		});
	});

	it("delete should return deletion status", async () => {
		const routesService = {
			delete: mockDelete,
		} as RoutesService;

		const controller = new RoutesController(mockLogger, routesService);

		const result = await controller.delete({
			body: {},
			params: { id: "1" },
			query: {},
			user: mockUser,
		});

		assert.deepStrictEqual(result, {
			payload: { data: true },
			status: HTTPCode.OK,
		});
	});
});
