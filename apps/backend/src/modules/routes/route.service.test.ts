import { type Knex } from "knex";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { type MapboxDirectionsApi } from "~/libs/modules/mapbox/mapbox.js";
import {
	type Coordinates,
	type LineStringGeometry,
} from "~/libs/types/types.js";

import { type FileService } from "../files/files.service.js";
import { type PlannedPathService } from "../planned-paths/planned-paths.js";
import {
	type PointsOfInterestGetAllItemResponseDto,
	type PointsOfInterestService,
} from "../points-of-interest/points-of-interest.js";
import { RoutesExceptionMessage } from "./libs/enums/enums.js";
import { RoutesError } from "./libs/exceptions/exceptions.js";
import {
	type RouteFindAllOptions,
	type RouteGetAllItemResponseDto,
	type RouteGetByIdResponseDto,
} from "./libs/types/types.js";
import { RouteEntity } from "./route.entity.js";
import { RouteModel } from "./route.model.js";
import { type RouteRepository } from "./route.repository.js";
import { RouteService } from "./route.service.js";

const EXISTING_ID = 1;
const FIRST_POI_ID = 1;
const SECOND_POI_ID = 2;
const NON_EXISTENT_ID = 999;
const FIRST_COORDINATE = 30.5234;
const SECOND_COORDINATE = 50.4501;
const FIRST_VISIT_ORDER = 0;
const SECOND_VISIT_ORDER = 1;
const FIRST_POI_NAME = "SUP Kayak Club 4 Storony";
const SECOND_POI_NAME = "River Grill, Rusanivska Embankment";
const FIRST_ENTITY_ID = 1;
const SECOND_ENTITY_ID = 2;

const geometry: LineStringGeometry = {
	coordinates: [
		[FIRST_COORDINATE, SECOND_COORDINATE],
		[SECOND_COORDINATE, FIRST_COORDINATE],
	] as Coordinates[],
	type: "LineString",
};
const mockPaginationMeta = {
	currentPage: 1,
	itemsPerPage: 1,
	total: 1,
	totalPages: 1,
};

const createMockMapboxApi = (): {
	api: MapboxDirectionsApi;
	getRoute: ReturnType<typeof mock.fn>;
} => {
	const getRoute = mock.fn(() =>
		Promise.resolve({
			internalId: "id",
			poiIds: [FIRST_POI_ID, SECOND_POI_ID],
			route: { distance: 1, duration: 1, geometry },
		}),
	);

	return { api: { getRoute } as unknown as MapboxDirectionsApi, getRoute };
};

const createMockFileService = (): FileService => ({}) as unknown as FileService;

describe("RouteService", () => {
	let originalKnexGetter: typeof RouteModel.knex;

	beforeEach(() => {
		originalKnexGetter = RouteModel.knex.bind(RouteModel);

		(RouteModel as unknown as { knex: () => Knex }).knex = (): Knex => {
			const knexStub = {
				transaction: async <T>(
					handler: (trx: Knex.Transaction) => Promise<T>,
				): Promise<T> => {
					const fakeTrx = {} as Knex.Transaction;

					return await handler(fakeTrx);
				},
			} as unknown as Knex;

			return knexStub;
		};
	});

	afterEach(() => {
		(RouteModel as unknown as { knex: typeof RouteModel.knex }).knex =
			originalKnexGetter;
	});
	const mockNotFoundError = new RoutesError({
		message: RoutesExceptionMessage.ROUTE_NOT_FOUND,
		status: HTTPCode.NOT_FOUND,
	});

	const mockCreatePayload = {
		createdByUserId: 5,
		description: "Test route description",
		imagesUrl: null,
		name: "Test Route",
		plannedPathId: 10,
		poiIds: [FIRST_POI_ID, SECOND_POI_ID],
	};

	const mockRouteIdResponse: RouteGetByIdResponseDto = {
		createdByUserId: 5,
		description: "Test route description",
		distance: 12.3,
		duration: 45.6,
		geometry,
		id: EXISTING_ID,
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
			{ id: FIRST_POI_ID, name: FIRST_POI_NAME, visitOrder: FIRST_VISIT_ORDER },
			{
				id: SECOND_POI_ID,
				name: SECOND_POI_NAME,
				visitOrder: SECOND_VISIT_ORDER,
			},
		],
	};

	const mockRouteAllItemResponse: RouteGetAllItemResponseDto = {
		createdByUserId: 5,
		distance: 12.3,
		duration: 45.6,
		geometry,
		id: EXISTING_ID,
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
			{ id: FIRST_POI_ID, name: FIRST_POI_NAME, visitOrder: FIRST_VISIT_ORDER },
			{
				id: SECOND_POI_ID,
				name: SECOND_POI_NAME,
				visitOrder: SECOND_VISIT_ORDER,
			},
		],
	};

	const mockPoisFindAll: PointsOfInterestGetAllItemResponseDto[] = [
		{
			createdAt: new Date().toISOString(),
			id: FIRST_POI_ID,
			location: {
				coordinates: [FIRST_COORDINATE, SECOND_COORDINATE],
				type: "Point",
			},
			name: "POI 1",
		},
		{
			createdAt: new Date().toISOString(),
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
					meta: mockPaginationMeta,
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
					routes: [],
				}),
		});

	const createMockPlannedPathService = (): PlannedPathService =>
		({
			create: () =>
				Promise.resolve({
					distance: 1,
					duration: 1,
					geometry,
					id: 99,
					pois: [FIRST_POI_ID, SECOND_POI_ID],
				}),
			delete: () => Promise.resolve(true),
			findById: () =>
				Promise.resolve({
					distance: 12.3,
					duration: 45.6,
					geometry,
					id: 10,
					pois: [FIRST_POI_ID, SECOND_POI_ID],
				}),
		}) as unknown as PlannedPathService;

	it("Should build mapbox route", async () => {
		const findAll = mock.fn(({ ids }: { ids: number[] }) =>
			Promise.resolve({
				items: mockPoisFindAll.filter(({ id }) => ids.includes(id)),
			}),
		);
		const poiServiceMock: PointsOfInterestService = {
			findAll,
			findById: mock.fn(),
		} as unknown as PointsOfInterestService;

		const { api: mapboxApiMock, getRoute } = createMockMapboxApi();
		const routesRepository = createMockRouteRepository();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();
		const service = new RouteService({
			fileService,
			mapboxDirectionsApi: mapboxApiMock,
			plannedPathService,
			pointsOfInterestService: poiServiceMock,
			routesRepository: routesRepository as RouteRepository,
		});

		const result = await service.construct([FIRST_ENTITY_ID, SECOND_ENTITY_ID]);

		assert.equal(findAll.mock.callCount(), 1);
		assert.equal(getRoute.mock.callCount(), 1);
		assert.equal(typeof result, "object");
	});

	it("Should throw error for unexisting id", async () => {
		const poiServiceMock: PointsOfInterestService = {
			findAll: ({ ids }: { ids: number[] }) =>
				Promise.resolve({
					items: [
						{
							id: FIRST_ENTITY_ID,
							location: {
								coordinates: [FIRST_POI_ID, SECOND_POI_ID],
								type: "Point",
							},
						},
					].filter(({ id }) => ids.includes(id)),
					meta: {
						currentPage: 0,
						itemsPerPage: 0,
						total: 0,
						totalPages: 0,
					},
				}) as ReturnType<PointsOfInterestService["findAll"]>,
			findById: mock.fn(),
		} as unknown as PointsOfInterestService;

		const { api: mapboxApiMock } = createMockMapboxApi();
		const routesRepository = createMockRouteRepository();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();
		const service = new RouteService({
			fileService,
			mapboxDirectionsApi: mapboxApiMock,
			plannedPathService,
			pointsOfInterestService: poiServiceMock,
			routesRepository: routesRepository as RouteRepository,
		});

		await assert.rejects(
			async () =>
				await service.construct([
					FIRST_ENTITY_ID,
					SECOND_ENTITY_ID,
					SECOND_ENTITY_ID + 1,
				]),
			RoutesError,
		);
	});

	it("create should return new route", async () => {
		const routesRepository = createMockRouteRepository();
		const pointsOfInterestService = createMockPointsOfInterestService();
		const { api: mapBoxApiMock } = createMockMapboxApi();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();

		const routeService = new RouteService({
			fileService,
			mapboxDirectionsApi: mapBoxApiMock,
			plannedPathService,
			pointsOfInterestService:
				pointsOfInterestService as PointsOfInterestService,
			routesRepository: routesRepository as RouteRepository,
		});

		const result = await routeService.create(mockCreatePayload);

		assert.deepStrictEqual(result, mockRouteIdResponse);
	});

	it("findById should return route when it exists", async () => {
		const routesRepository = createMockRouteRepository();
		const pointsOfInterestService = createMockPointsOfInterestService();
		const { api: mapBoxApiMock } = createMockMapboxApi();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();

		const routeService = new RouteService({
			fileService,
			mapboxDirectionsApi: mapBoxApiMock,
			plannedPathService,
			pointsOfInterestService:
				pointsOfInterestService as PointsOfInterestService,
			routesRepository: routesRepository as RouteRepository,
		});

		const result = await routeService.findById(EXISTING_ID);

		assert.deepStrictEqual(result, mockRouteIdResponse);
	});

	it("findById should throw an error when route does not exist", async () => {
		const routesRepository = createMockRouteRepository({
			findById: () => Promise.resolve(null),
		});
		const pointsOfInterestService = createMockPointsOfInterestService();
		const { api: mapBoxApiMock } = createMockMapboxApi();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();

		const routeService = new RouteService({
			fileService,
			mapboxDirectionsApi: mapBoxApiMock,
			plannedPathService,
			pointsOfInterestService:
				pointsOfInterestService as PointsOfInterestService,
			routesRepository: routesRepository as RouteRepository,
		});

		await assert.rejects(async () => {
			await routeService.findById(NON_EXISTENT_ID);
		}, mockNotFoundError);
	});

	it("findAll should return all routes if options are not provided", async () => {
		const routesRepository = createMockRouteRepository({
			findAll: () =>
				Promise.resolve([createMockAllItemEntity(mockRouteAllItemResponse)]),
		});
		const pointsOfInterestService = createMockPointsOfInterestService();
		const { api: mapBoxApiMock } = createMockMapboxApi();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();

		const routeService = new RouteService({
			fileService,
			mapboxDirectionsApi: mapBoxApiMock,
			plannedPathService,
			pointsOfInterestService:
				pointsOfInterestService as PointsOfInterestService,
			routesRepository: routesRepository as RouteRepository,
		});

		const result = await routeService.findAll(null);

		assert.deepStrictEqual(result, { items: [mockRouteAllItemResponse] });
	});

	it("findAll should return empty array when no routes exist", async () => {
		const routesRepository = createMockRouteRepository({
			findAll: () => Promise.resolve([]),
		});
		const { api: mapBoxApiMock } = createMockMapboxApi();
		const pointsOfInterestService = createMockPointsOfInterestService();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();

		const routeService = new RouteService({
			fileService,
			mapboxDirectionsApi: mapBoxApiMock,
			plannedPathService,
			pointsOfInterestService:
				pointsOfInterestService as PointsOfInterestService,
			routesRepository: routesRepository as RouteRepository,
		});

		const result = await routeService.findAll(null);

		assert.deepStrictEqual(result, { items: [] });
	});

	it("findAll should return response with routes that match search query", async () => {
		const routesRepository = createMockRouteRepository();
		const { api: mapBoxApiMock } = createMockMapboxApi();
		const pointsOfInterestService = createMockPointsOfInterestService();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();

		const routeService = new RouteService({
			fileService,
			mapboxDirectionsApi: mapBoxApiMock,
			plannedPathService,
			pointsOfInterestService:
				pointsOfInterestService as PointsOfInterestService,
			routesRepository: routesRepository as RouteRepository,
		});

		const mockOptions: RouteFindAllOptions = {
			name: mockCreatePayload.name.toLowerCase(),
		};

		const result = await routeService.findAll(mockOptions);

		assert.deepStrictEqual(result, { items: [mockRouteAllItemResponse] });
	});

	it("patch should update existing route successfully", async () => {
		const updatedRoute = { ...mockRouteIdResponse, ...mockPatchPayload };

		const { api: mapBoxApiMock } = createMockMapboxApi();
		const routesRepository = createMockRouteRepository({
			patch: () => Promise.resolve(createMockIdEntity(updatedRoute)),
		});
		const pointsOfInterestService = createMockPointsOfInterestService();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();

		const routeService = new RouteService({
			fileService,
			mapboxDirectionsApi: mapBoxApiMock,
			plannedPathService,
			pointsOfInterestService:
				pointsOfInterestService as PointsOfInterestService,
			routesRepository: routesRepository as RouteRepository,
		});

		const result = await routeService.patch(EXISTING_ID, mockPatchPayload);

		assert.deepStrictEqual(result, updatedRoute);
	});

	it("patch should throw an error when route does not exist", async () => {
		const routesRepository = createMockRouteRepository({
			patch: () => Promise.resolve(null),
		});
		const { api: mapBoxApiMock } = createMockMapboxApi();
		const pointsOfInterestService = createMockPointsOfInterestService();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();

		const routeService = new RouteService({
			fileService,
			mapboxDirectionsApi: mapBoxApiMock,
			plannedPathService,
			pointsOfInterestService:
				pointsOfInterestService as PointsOfInterestService,
			routesRepository: routesRepository as RouteRepository,
		});

		await assert.rejects(async () => {
			await routeService.patch(NON_EXISTENT_ID, mockPatchPayload);
		}, mockNotFoundError);
	});

	it("delete should delete existing route successfully", async () => {
		const routesRepository = createMockRouteRepository();
		const pointsOfInterestService = createMockPointsOfInterestService();
		const { api: mapBoxApiMock } = createMockMapboxApi();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();

		const routeService = new RouteService({
			fileService,
			mapboxDirectionsApi: mapBoxApiMock,
			plannedPathService,
			pointsOfInterestService:
				pointsOfInterestService as PointsOfInterestService,
			routesRepository: routesRepository as RouteRepository,
		});

		const result = await routeService.delete(EXISTING_ID);

		assert.strictEqual(result, true);
	});

	it("delete should throw an error when trying to delete non-existent route", async () => {
		const routesRepository = createMockRouteRepository({
			delete: () => Promise.resolve(false),
		});
		const pointsOfInterestService = createMockPointsOfInterestService();
		const { api: mapBoxApiMock } = createMockMapboxApi();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();

		const routeService = new RouteService({
			fileService,
			mapboxDirectionsApi: mapBoxApiMock,
			plannedPathService,
			pointsOfInterestService:
				pointsOfInterestService as PointsOfInterestService,
			routesRepository: routesRepository as RouteRepository,
		});

		await assert.rejects(async () => {
			await routeService.delete(NON_EXISTENT_ID);
		}, mockNotFoundError);
	});

	it("ensurePoisExist should validate all POIs exist before creating route", async () => {
		const routesRepository = createMockRouteRepository();
		const pointsOfInterestService = createMockPointsOfInterestService();
		const { api: mapBoxApiMock } = createMockMapboxApi();
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();

		const routeService = new RouteService({
			fileService,
			mapboxDirectionsApi: mapBoxApiMock,
			plannedPathService,
			pointsOfInterestService:
				pointsOfInterestService as PointsOfInterestService,
			routesRepository: routesRepository as RouteRepository,
		});

		const result = await routeService.create(mockCreatePayload);

		assert.deepStrictEqual(result, mockRouteIdResponse);
	});

	it("ensurePoisExist should throw error when POI does not exist", async () => {
		const routesRepository = createMockRouteRepository();
		const { api: mapBoxApiMock } = createMockMapboxApi();
		const basePoiService = createMockPointsOfInterestService();
		const pointsOfInterestService: PointsOfInterestService = {
			findAll: () => Promise.resolve({ items: [mockPoisFindAll[0]] }),
			findById: (id: number) => basePoiService.findById?.(id),
		} as unknown as PointsOfInterestService;
		const plannedPathService = createMockPlannedPathService();
		const fileService = createMockFileService();

		const routeService = new RouteService({
			fileService,
			mapboxDirectionsApi: mapBoxApiMock,
			plannedPathService,
			pointsOfInterestService,
			routesRepository: routesRepository as RouteRepository,
		});

		await assert.rejects(
			async () => {
				await routeService.create(mockCreatePayload);
			},
			{
				message: RoutesExceptionMessage.POI_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			},
		);
	});
});
