import {
	HTTPCode,
	type PointsOfInterestResponseDto,
	type RouteGetAllItemResponseDto,
	type RouteGetByIdResponseDto,
} from "@smartscapes/shared";
import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { type MapboxDirectionsApi } from "~/libs/modules/mapbox/mapbox-directions-api.module.js";
import { type PointGeometry } from "~/libs/types/types.js";

import { type PointsOfInterestService } from "../points-of-interest/points-of-interest.service.js";
import { RoutesExceptionMessage } from "./libs/enums/routes-exception-message.enum.js";
import { RoutesError } from "./libs/exceptions/routes-error.exception.js";
import { type RouteFindAllOptions } from "./libs/types/types.js";
import { RouteEntity } from "./route.entity.js";
import { type RouteRepository } from "./route.repository.js";
import { RouteService } from "./route.service.js";

const EXISTING_ID = 1;
const FIRST_POI_ID = 1;
const SECOND_POI_ID = 2;
const THIRD_POI_ID = 3;
const FOURTH_POI_ID = 4;
const NON_EXISTENT_ID = 999;
const FIRST_COORDINATE = 30.5234;
const SECOND_COORDINATE = 50.4501;
const FIRST_VISIT_ORDER = 0;
const SECOND_VISIT_ORDER = 1;
const FIRST_ENTITY_ID = 1;
const SECOND_ENTITY_ID = 2;
const THIRD_ENTITY_ID = 3;

const createMockMapboxApi = (): Partial<MapboxDirectionsApi> => {
	return {
		getRoute: () => ({}) as ReturnType<MapboxDirectionsApi["getRoute"]>,
	};
};

describe("RouteService", () => {
	const mockNotFoundError = new RoutesError({
		message: RoutesExceptionMessage.ROUTE_NOT_FOUND,
		status: HTTPCode.NOT_FOUND,
	});

	const mockCreatePayload = {
		description: "Test route description",
		name: "Test Route",
		pois: [FIRST_POI_ID, SECOND_POI_ID],
	};

	const mockRouteIdResponse: RouteGetByIdResponseDto = {
		description: "Test route description",
		id: EXISTING_ID,
		name: "Test Route",
		pois: [
			{ id: FIRST_POI_ID, visitOrder: FIRST_VISIT_ORDER },
			{ id: SECOND_POI_ID, visitOrder: SECOND_VISIT_ORDER },
		],
	};

	const mockRouteAllItemResponse: RouteGetAllItemResponseDto = {
		id: EXISTING_ID,
		name: "Test Route",
		pois: [
			{ id: FIRST_POI_ID, visitOrder: FIRST_VISIT_ORDER },
			{ id: SECOND_POI_ID, visitOrder: SECOND_VISIT_ORDER },
		],
	};

	const mockPoisFindAll: PointsOfInterestResponseDto[] = [
		{
			description: "Description for POI 1",
			id: FIRST_POI_ID,
			location: {
				coordinates: [FIRST_COORDINATE, SECOND_COORDINATE],
				type: "Point",
			},
			name: "POI 1",
		},
		{
			description: "Description for POI 2",
			id: SECOND_POI_ID,
			location: {
				coordinates: [SECOND_COORDINATE, FIRST_COORDINATE],
				type: "Point",
			},
			name: "POI 2",
		},
	];

	const mockPatchPayload = {
		description: "Updated description",
		name: "Updated Route",
	};

	const createMockIdEntity = (data: RouteGetByIdResponseDto): RouteEntity => {
		return RouteEntity.initialize(data);
	};

	const createMockAllItemEntity = (
		data: RouteGetAllItemResponseDto,
	): RouteEntity => {
		return RouteEntity.initializeList(data);
	};

	const createMockRouteRepository = (
		overrides = {},
	): Partial<RouteRepository> => ({
		create: () => Promise.resolve(createMockIdEntity(mockRouteIdResponse)),
		delete: () => Promise.resolve(true),
		findAll: () =>
			Promise.resolve([createMockAllItemEntity(mockRouteAllItemResponse)]),
		findById: () => Promise.resolve(createMockIdEntity(mockRouteIdResponse)),
		patch: () =>
			Promise.resolve(
				createMockIdEntity({ ...mockRouteIdResponse, ...mockPatchPayload }),
			),
		...overrides,
	});

	const createMockPointsOfInterestService =
		(): Partial<PointsOfInterestService> => ({
			findAll: () =>
				Promise.resolve({
					items: mockPoisFindAll,
				}),
			findById: () =>
				Promise.resolve({
					createdAt: new Date().toISOString(),
					description: "Test POI description",
					id: FIRST_POI_ID,
					location: {
						coordinates: [FIRST_COORDINATE, SECOND_COORDINATE],
						type: "Point",
					},
					name: "Test POI",
				}),
		});

	it("Should build mapbox route", async () => {
		const entitiesIds = [FIRST_ENTITY_ID, SECOND_ENTITY_ID];
		const entities = [
			{
				id: FIRST_ENTITY_ID,
				location: { coordinates: [FIRST_POI_ID, SECOND_POI_ID] },
			},
			{
				id: SECOND_ENTITY_ID,
				location: { coordinates: [THIRD_POI_ID, FOURTH_POI_ID] },
			},
		];
		const getRoute = mock.fn(
			(_: string, coords: PointGeometry["coordinates"][]) =>
				Promise.resolve(coords),
		);
		const findAll = mock.fn(({ ids }: { ids: number[] }) => {
			return Promise.resolve({
				items: entities.filter(({ id }) => ids.includes(id)),
			});
		});

		const poiServiceMock = {
			findAll,
		} as unknown as PointsOfInterestService;

		const mapboxApiMock = {
			getRoute,
		} as unknown as MapboxDirectionsApi;
		const mockRepository = {} as RouteRepository;
		const routeService = new RouteService(
			mockRepository,
			poiServiceMock,
			mapboxApiMock,
		);
		const constructedRoute = (await routeService.construct([
			FIRST_POI_ID,
			SECOND_POI_ID,
		])) as unknown as [];

		const shouldBeCalledTimes = 1;

		assert.equal(findAll.mock.callCount(), shouldBeCalledTimes);
		assert.equal(getRoute.mock.callCount(), shouldBeCalledTimes);
		assert.equal(Array.isArray(constructedRoute), true);
		assert.equal(constructedRoute.length, entitiesIds.length);
		assert.equal(
			constructedRoute.toString(),
			entities.map(({ location }) => location.coordinates).toString(),
		);
	});

	it("Should throw error for unexisting id", () => {
		const entitiesIds = [FIRST_ENTITY_ID, SECOND_ENTITY_ID, THIRD_ENTITY_ID];
		const entities = [
			{
				id: FIRST_ENTITY_ID,
				location: { coordinates: [FIRST_POI_ID, SECOND_POI_ID] },
			},
		];
		const findAll = mock.fn(
			async ({ ids }: { ids: number[] }) =>
				await Promise.resolve({
					items: entities.filter(({ id }) => ids.includes(id)),
				}),
		);

		const poiServiceMock = {
			findAll,
		} as unknown as PointsOfInterestService;

		const mapboxApiMock = createMockMapboxApi() as MapboxDirectionsApi;
		const repository = createMockRouteRepository() as RouteRepository;
		const routeService = new RouteService(
			repository,
			poiServiceMock,
			mapboxApiMock,
		);

		assert.rejects(
			async () => await routeService.construct(entitiesIds),
			RoutesError,
		);
	});

	it("create should return new route", async () => {
		const routesRepository = createMockRouteRepository();
		const pointsOfInterestService = createMockPointsOfInterestService();
		const mapBoxApiMock = createMockMapboxApi();

		const routesService = new RouteService(
			routesRepository as RouteRepository,
			pointsOfInterestService as PointsOfInterestService,
			mapBoxApiMock as MapboxDirectionsApi,
		);

		const result = await routesService.create(mockCreatePayload);

		assert.deepStrictEqual(result, mockRouteIdResponse);
	});

	it("findById should return route when it exists", async () => {
		const routesRepository = createMockRouteRepository();
		const pointsOfInterestService = createMockPointsOfInterestService();
		const mapBoxApiMock = createMockMapboxApi();

		const routesService = new RouteService(
			routesRepository as RouteRepository,
			pointsOfInterestService as PointsOfInterestService,
			mapBoxApiMock as MapboxDirectionsApi,
		);

		const result = await routesService.findById(EXISTING_ID);

		assert.deepStrictEqual(result, mockRouteIdResponse);
	});

	it("findById should throw an error when route does not exist", async () => {
		const routesRepository = createMockRouteRepository({
			findById: () => Promise.resolve(null),
		});
		const pointsOfInterestService = createMockPointsOfInterestService();
		const mapBoxApiMock = createMockMapboxApi();

		const routesService = new RouteService(
			routesRepository as RouteRepository,
			pointsOfInterestService as PointsOfInterestService,
			mapBoxApiMock as MapboxDirectionsApi,
		);

		await assert.rejects(async () => {
			await routesService.findById(NON_EXISTENT_ID);
		}, mockNotFoundError);
	});

	it("findAll should return all routes if options are not provided", async () => {
		const routesRepository = createMockRouteRepository({
			findAll: () =>
				Promise.resolve([createMockAllItemEntity(mockRouteAllItemResponse)]),
		});
		const pointsOfInterestService = createMockPointsOfInterestService();
		const mapBoxApiMock = createMockMapboxApi();

		const routesService = new RouteService(
			routesRepository as RouteRepository,
			pointsOfInterestService as PointsOfInterestService,
			mapBoxApiMock as MapboxDirectionsApi,
		);

		const result = await routesService.findAll(null);
		assert.deepStrictEqual(result, { items: [mockRouteAllItemResponse] });
	});

	it("findAll should return empty array when no routes exist", async () => {
		const routesRepository = createMockRouteRepository({
			findAll: () => Promise.resolve([]),
		});
		const mapBoxApiMock = createMockMapboxApi();

		const pointsOfInterestService = createMockPointsOfInterestService();
		const routesService = new RouteService(
			routesRepository as RouteRepository,
			pointsOfInterestService as PointsOfInterestService,
			mapBoxApiMock as MapboxDirectionsApi,
		);

		const result = await routesService.findAll(null);

		assert.deepStrictEqual(result, { items: [] });
	});

	it("findAll should return response with routes that match search query", async () => {
		const routesRepository = createMockRouteRepository();

		const mapBoxApiMock = createMockMapboxApi();

		const pointsOfInterestService = createMockPointsOfInterestService();
		const routesService = new RouteService(
			routesRepository as RouteRepository,
			pointsOfInterestService as PointsOfInterestService,
			mapBoxApiMock as MapboxDirectionsApi,
		);

		const mockOptions: RouteFindAllOptions = {
			name: mockCreatePayload.name.toLowerCase(),
		};

		const result = await routesService.findAll(mockOptions);

		assert.deepStrictEqual(result, { items: [mockRouteAllItemResponse] });
	});

	it("patch should update existing route successfully", async () => {
		const updatedRoute = { ...mockRouteIdResponse, ...mockPatchPayload };
		const mapBoxApiMock = createMockMapboxApi();
		const routesRepository = createMockRouteRepository({
			patch: () => Promise.resolve(createMockIdEntity(updatedRoute)),
		});

		const pointsOfInterestService = createMockPointsOfInterestService();
		const routesService = new RouteService(
			routesRepository as RouteRepository,
			pointsOfInterestService as PointsOfInterestService,
			mapBoxApiMock as MapboxDirectionsApi,
		);

		const result = await routesService.patch(EXISTING_ID, mockPatchPayload);

		assert.deepStrictEqual(result, updatedRoute);
	});

	it("patch should throw an error when route does not exist", async () => {
		const routesRepository = createMockRouteRepository({
			patch: () => Promise.resolve(null),
		});
		const mapBoxApiMock = createMockMapboxApi();
		const pointsOfInterestService = createMockPointsOfInterestService();

		const routesService = new RouteService(
			routesRepository as RouteRepository,
			pointsOfInterestService as PointsOfInterestService,
			mapBoxApiMock as MapboxDirectionsApi,
		);

		await assert.rejects(async () => {
			await routesService.patch(NON_EXISTENT_ID, mockPatchPayload);
		}, mockNotFoundError);
	});

	it("delete should delete existing route successfully", async () => {
		const routesRepository = createMockRouteRepository();
		const pointsOfInterestService = createMockPointsOfInterestService();
		const mapBoxApiMock = createMockMapboxApi();
		const routesService = new RouteService(
			routesRepository as RouteRepository,
			pointsOfInterestService as PointsOfInterestService,
			mapBoxApiMock as MapboxDirectionsApi,
		);

		const result = await routesService.delete(EXISTING_ID);

		assert.strictEqual(result, true);
	});

	it("delete should throw an error when trying to delete non-existent route", async () => {
		const routesRepository = createMockRouteRepository({
			delete: () => Promise.resolve(false),
		});
		const pointsOfInterestService = createMockPointsOfInterestService();
		const mapBoxApiMock = createMockMapboxApi();
		const routesService = new RouteService(
			routesRepository as RouteRepository,
			pointsOfInterestService as PointsOfInterestService,
			mapBoxApiMock as MapboxDirectionsApi,
		);

		await assert.rejects(async () => {
			await routesService.delete(NON_EXISTENT_ID);
		}, mockNotFoundError);
	});

	it("ensurePoisExist should validate all POIs exist before creating route", async () => {
		const routesRepository = createMockRouteRepository();
		const pointsOfInterestService = createMockPointsOfInterestService();
		const mapBoxApiMock = createMockMapboxApi();
		const routesService = new RouteService(
			routesRepository as RouteRepository,
			pointsOfInterestService as PointsOfInterestService,
			mapBoxApiMock as MapboxDirectionsApi,
		);

		const result = await routesService.create(mockCreatePayload);

		assert.deepStrictEqual(result, mockRouteIdResponse);
	});

	it("ensurePoisExist should throw error when POI does not exist", async () => {
		const routesRepository = createMockRouteRepository();
		const mapBoxApiMock = createMockMapboxApi();
		const pointsOfInterestService = {
			...createMockPointsOfInterestService(),
			findAll: (): unknown => Promise.resolve({ items: [mockPoisFindAll[0]] }),
		};
		const routesService = new RouteService(
			routesRepository as RouteRepository,
			pointsOfInterestService as unknown as PointsOfInterestService,
			mapBoxApiMock as MapboxDirectionsApi,
		);

		await assert.rejects(
			async () => {
				await routesService.create(mockCreatePayload);
			},
			{
				message: RoutesExceptionMessage.POI_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			},
		);
	});
});
