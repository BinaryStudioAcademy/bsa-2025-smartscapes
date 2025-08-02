import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";

import { type PointsOfInterestService } from "../points-of-interest/points-of-interest.service.js";
import { RoutesExceptionMessage } from "./libs/enums/routes-exception-message.enum.js";
import { RoutesError } from "./libs/exceptions/point-of-interest.exception.js";
import { RouteEntity } from "./routes.entity.js";
import { type RoutesRepository } from "./routes.repository.js";
import { RoutesService } from "./routes.service.js";

const EXISTING_ID = 1;
const FIRST_POI_ID = 1;
const SECOND_POI_ID = 2;
const FIRST_VISIT_ORDER = 0;
const SECOND_VISIT_ORDER = 1;
const NON_EXISTENT_ID = 999;

describe("RoutesService", () => {
	const mockRoute: Parameters<typeof RouteEntity.initializeNew>[0] = {
		description: "Test route description",
		name: "Test Route",
		pois: [
			{ id: FIRST_POI_ID, visitOrder: FIRST_VISIT_ORDER },
			{ id: SECOND_POI_ID, visitOrder: SECOND_VISIT_ORDER },
		],
	};

	const createMockEntity = (): RouteEntity =>
		RouteEntity.initializeNew(mockRoute);

	it("create should return new route", async () => {
		const routeEntity = RouteEntity.initializeNew(mockRoute);

		const routesRepository = {
			create: (() =>
				Promise.resolve(routeEntity)) as RoutesRepository["create"],
		} as RoutesRepository;

		const pointsOfInterestService = {
			findById: ((id: number) =>
				Promise.resolve({
					createdAt: new Date().toISOString(),
					description: "Test POI description",
					id,
					name: "Test POI",
				})) as PointsOfInterestService["findById"],
		} as PointsOfInterestService;

		const routesService = new RoutesService(
			routesRepository,
			pointsOfInterestService,
		);

		const result = await routesService.create({
			description: mockRoute.description,
			name: mockRoute.name,
			pois: [FIRST_POI_ID, SECOND_POI_ID],
		});

		assert.deepStrictEqual(result, routeEntity.toObject());
	});

	it("create should throw error when POI does not exist", async () => {
		const routesRepository = {} as RoutesRepository;

		const pointsOfInterestService = {
			findById: (() =>
				Promise.reject(
					new Error("POI not found"),
				)) as PointsOfInterestService["findById"],
		} as PointsOfInterestService;

		const routesService = new RoutesService(
			routesRepository,
			pointsOfInterestService,
		);

		await assert.rejects(
			async () => {
				await routesService.create({
					description: mockRoute.description,
					name: mockRoute.name,
					pois: [NON_EXISTENT_ID],
				});
			},
			(error: RoutesError) => {
				assert.strictEqual(error.message, RoutesExceptionMessage.POI_NOT_FOUND);
				assert.strictEqual(error.status, HTTPCode.CONFLICT);

				return true;
			},
		);
	});

	it("findAll should return all routes", async () => {
		const routeEntity = createMockEntity();

		const routesRepository = {
			findAll: () => Promise.resolve([routeEntity]),
		} as RoutesRepository;

		const pointsOfInterestService = {} as PointsOfInterestService;

		const routesService = new RoutesService(
			routesRepository,
			pointsOfInterestService,
		);

		const result = await routesService.findAll();

		assert.deepStrictEqual(result, {
			items: [routeEntity.toObject()],
		});
	});

	it("find should return route by id", async () => {
		const routeEntity = createMockEntity();

		const routesRepository = {
			findById: (() =>
				Promise.resolve(routeEntity)) as RoutesRepository["findById"],
		} as RoutesRepository;

		const pointsOfInterestService = {} as PointsOfInterestService;

		const routesService = new RoutesService(
			routesRepository,
			pointsOfInterestService,
		);

		const result = await routesService.findById(EXISTING_ID);

		assert.deepStrictEqual(result, routeEntity.toObject());
	});

	it("find should return an error when route not found", async () => {
		const routesRepository = {
			findById: (() => {
				throw new RoutesError({
					message: RoutesExceptionMessage.ROUTE_NOT_FOUND,
					status: HTTPCode.NOT_FOUND,
				});
			}) as RoutesRepository["patch"],
		} as RoutesRepository;
		const pointsOfInterestService = {} as PointsOfInterestService;

		const routesService = new RoutesService(
			routesRepository,
			pointsOfInterestService,
		);

		try {
			await routesService.findById(NON_EXISTENT_ID);
		} catch (error) {
			assert.strictEqual(
				(error as RoutesError).message,
				RoutesExceptionMessage.ROUTE_NOT_FOUND,
			);
		}
	});

	it("update should return updated route", async () => {
		const updatedRoute = {
			...mockRoute,
			name: "Updated Test Route",
		};
		const routeEntity = RouteEntity.initializeNew(updatedRoute);

		const routesRepository = {
			findById: (() =>
				Promise.resolve(routeEntity)) as RoutesRepository["findById"],
			patch: (() => Promise.resolve(routeEntity)) as RoutesRepository["patch"],
		} as RoutesRepository;

		const pointsOfInterestService = {
			findById: ((id: number) =>
				Promise.resolve({
					createdAt: new Date().toISOString(),
					description: "Test POI description",
					id,
					name: "Test POI",
				})) as PointsOfInterestService["findById"],
		} as PointsOfInterestService;

		const routesService = new RoutesService(
			routesRepository,
			pointsOfInterestService,
		);

		const result = await routesService.patch(EXISTING_ID, {
			description: updatedRoute.description,
			name: updatedRoute.name,
			pois: [FIRST_POI_ID, SECOND_POI_ID],
		});

		assert.deepStrictEqual(result, routeEntity.toObject());
	});

	it("update should return an error when route not found", async () => {
		const routesRepository = {
			findById: (() => {
				throw new RoutesError({
					message: RoutesExceptionMessage.ROUTE_NOT_FOUND,
					status: HTTPCode.NOT_FOUND,
				});
			}) as RoutesRepository["findById"],
			patch: (() => {
				throw new RoutesError({
					message: RoutesExceptionMessage.ROUTE_NOT_FOUND,
					status: HTTPCode.NOT_FOUND,
				});
			}) as RoutesRepository["patch"],
		} as RoutesRepository;

		const pointsOfInterestService = {
			findById: ((id: number) =>
				Promise.resolve({
					createdAt: new Date().toISOString(),
					description: "Test POI description",
					id,
					name: "Test POI",
				})) as PointsOfInterestService["findById"],
		} as PointsOfInterestService;

		const routesService = new RoutesService(
			routesRepository,
			pointsOfInterestService,
		);

		try {
			await routesService.patch(NON_EXISTENT_ID, {
				description: "Updated description",
				name: "Updated Test Route",
				pois: [FIRST_POI_ID, SECOND_POI_ID],
			});
		} catch (error) {
			assert.strictEqual(
				(error as RoutesError).message,
				RoutesExceptionMessage.ROUTE_NOT_FOUND,
			);
		}
	});

	it("delete should return true when route deleted", async () => {
		const routesRepository = {
			delete: (() => Promise.resolve(true)) as RoutesRepository["delete"],
			findById: (() =>
				Promise.resolve(createMockEntity())) as RoutesRepository["findById"],
		} as RoutesRepository;

		const pointsOfInterestService = {} as PointsOfInterestService;

		const routesService = new RoutesService(
			routesRepository,
			pointsOfInterestService,
		);

		const result = await routesService.delete(EXISTING_ID);

		assert.strictEqual(result, true);
	});

	it("delete should return an error when route not found", async () => {
		const routesRepository = {
			delete: (() => Promise.resolve(false)) as RoutesRepository["delete"],
			findById: (() => {
				throw new RoutesError({
					message: RoutesExceptionMessage.ROUTE_NOT_FOUND,
					status: HTTPCode.NOT_FOUND,
				});
			}) as RoutesRepository["patch"],
		} as RoutesRepository;

		const pointsOfInterestService = {} as PointsOfInterestService;

		const routesService = new RoutesService(
			routesRepository,
			pointsOfInterestService,
		);

		try {
			await routesService.delete(NON_EXISTENT_ID);
		} catch (error) {
			assert.strictEqual(
				(error as RoutesError).message,
				RoutesExceptionMessage.ROUTE_NOT_FOUND,
			);
		}
	});
});
