import { HTTPCode } from "~/libs/enums/enums.js";
import {
	MapboxAPIGeometric,
	MapboxAPIProfile,
	type MapboxDirectionsApi,
} from "~/libs/modules/mapbox/mapbox.js";
import { type CollectionResult, type Service } from "~/libs/types/types.js";

import { type PointsOfInterestService } from "../points-of-interest/points-of-interest.service.js";
import { RoutesExceptionMessage } from "./libs/enums/enums.js";
import { RoutesError } from "./libs/exceptions/exceptions.js";
import {
	type RouteConstructResponseDto,
	type RouteCreateRequestDto,
	type RouteFindAllOptions,
	type RouteGetAllItemResponseDto,
	type RouteGetByIdResponseDto,
	type RoutePatchRequestDto,
} from "./libs/types/types.js";
import { RouteEntity } from "./route.entity.js";
import { type RouteRepository } from "./route.repository.js";

class RouteService implements Service {
	private mapboxDirectionApi: MapboxDirectionsApi;
	private pointsOfInterestService: PointsOfInterestService;
	private routesRepository: RouteRepository;

	public constructor(
		routesRepository: RouteRepository,
		pointsOfInterestService: PointsOfInterestService,
		mapboxDirectionsApi: MapboxDirectionsApi,
	) {
		this.routesRepository = routesRepository;
		this.pointsOfInterestService = pointsOfInterestService;
		this.mapboxDirectionApi = mapboxDirectionsApi;
	}

	public async construct(
		pointsOfInterest: number[],
	): Promise<RouteConstructResponseDto> {
		const { items } = await this.pointsOfInterestService.findAll({
			ids: pointsOfInterest,
		});

		if (items.length !== pointsOfInterest.length) {
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

		return route;
	}

	public async create(
		payload: RouteCreateRequestDto,
	): Promise<RouteGetByIdResponseDto> {
		await this.ensurePoisExist(payload.pois);

		const formattedPayload = {
			...payload,
			pois: payload.pois.map((id, index) => ({
				id,
				visitOrder: index,
			})),
		};

		const routeEntity = RouteEntity.initializeNew(formattedPayload);

		const route = await this.routesRepository.create(routeEntity);

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
		if (options?.categories) {
			options.categories = Array.isArray(options.categories)
				? options.categories
				: [options.categories];
		}

		const items = await this.routesRepository.findAll(options);

		return {
			items: items.map((item) => item.toListObject()),
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
