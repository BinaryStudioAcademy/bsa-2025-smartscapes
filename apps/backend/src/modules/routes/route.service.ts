import { HTTPCode } from "~/libs/enums/enums.js";
import {
	MapboxAPIGeometric,
	MapboxAPIProfile,
	type MapboxDirectionsApi,
} from "~/libs/modules/mapbox/mapbox.js";
import { type CollectionResult, type Service } from "~/libs/types/types.js";

import { type PlannedPathResponseDto } from "../planned-routes/libs/types/planned-path-response-dto.type.js";
import { type PlannedPathService } from "../planned-routes/planned-path.service.js";
import { type PointsOfInterestService } from "../points-of-interest/points-of-interest.service.js";
import { RoutesExceptionMessage } from "./libs/enums/enums.js";
import { RoutesError } from "./libs/exceptions/exceptions.js";
import {
	type RouteCreateRequestDto,
	type RouteFindAllOptions,
	type RouteGetAllItemResponseDto,
	type RouteGetByIdResponseDto,
	type RoutePatchRequestDto,
} from "./libs/types/types.js";
import { RouteEntity } from "./route.entity.js";
import { type RouteRepository } from "./route.repository.js";

type ConstructorParameters = {
	mapboxDirectionsApi: MapboxDirectionsApi;
	plannedPathService: PlannedPathService;
	pointsOfInterestService: PointsOfInterestService;
	routesRepository: RouteRepository;
};

class RouteService implements Service {
	private mapboxDirectionApi: MapboxDirectionsApi;
	private plannedPathService: PlannedPathService;
	private pointsOfInterestService: PointsOfInterestService;
	private routesRepository: RouteRepository;

	public constructor({
		mapboxDirectionsApi,
		plannedPathService,
		pointsOfInterestService,
		routesRepository,
	}: ConstructorParameters) {
		this.routesRepository = routesRepository;
		this.pointsOfInterestService = pointsOfInterestService;
		this.mapboxDirectionApi = mapboxDirectionsApi;
		this.plannedPathService = plannedPathService;
	}

	public async construct(poiIds: number[]): Promise<PlannedPathResponseDto> {
		const { items } = await this.pointsOfInterestService.findAll({
			ids: poiIds,
		});

		if (items.length !== poiIds.length) {
			throw new RoutesError({
				message: RoutesExceptionMessage.POI_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const coordinates = items.map(({ location }) => location.coordinates);

		const route = await this.mapboxDirectionApi.getRoute(
			MapboxAPIProfile.WALKING,
			coordinates,
			MapboxAPIGeometric.GEOJSON,
		);

		const plannedRoute = await this.plannedPathService.create(route);

		return plannedRoute;
	}

	public async create(
		payload: RouteCreateRequestDto,
	): Promise<RouteGetByIdResponseDto> {
		await this.ensurePoisExist(payload.poiIds);

		const formattedPayload = {
			...payload,
			pois: payload.poiIds.map((id, index) => ({
				id,
				visitOrder: index,
			})),
		};

		const { plannedPathId } = formattedPayload;

		const plannedRoute = await this.plannedPathService.findById(plannedPathId);

		const routeEntity = RouteEntity.initializeNew({
			...formattedPayload,
			...plannedRoute,
		});

		const route = await this.routesRepository.create(routeEntity);

		await this.plannedPathService.delete(plannedPathId);

		return route.toObject();
	}

	public async delete(id: number): Promise<boolean> {
		const isDeleted = await this.routesRepository.delete(id);

		if (!isDeleted) {
			throw new RoutesError({
				message: RoutesExceptionMessage.ROUTE_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return isDeleted;
	}

	public async findAll(
		options: null | RouteFindAllOptions,
	): Promise<CollectionResult<RouteGetAllItemResponseDto>> {
		const items = await this.routesRepository.findAll(options);

		return {
			items: items.map((item) => {
				return item.toListObject();
			}),
		};
	}

	public async findById(id: number): Promise<RouteGetByIdResponseDto> {
		const item = await this.routesRepository.findById(id);

		if (!item) {
			throw new RoutesError({
				message: RoutesExceptionMessage.ROUTE_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return item.toObject();
	}

	public async patch(
		id: number,
		payload: RoutePatchRequestDto,
	): Promise<RouteGetByIdResponseDto> {
		const item = await this.routesRepository.patch(id, payload);

		if (!item) {
			throw new RoutesError({
				message: RoutesExceptionMessage.ROUTE_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return item.toObject();
	}

	private async ensurePoisExist(pois: number[]): Promise<void> {
		const filteredPois = await this.pointsOfInterestService.findAll({
			ids: pois,
		});

		if (pois.length !== filteredPois.items.length) {
			throw new RoutesError({
				message: RoutesExceptionMessage.POI_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}
	}
}

export { RouteService };
