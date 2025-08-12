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
	type RoutesRequestCreateDto,
	type RoutesRequestPatchDto,
	type RoutesResponseConstructDto,
	type RoutesResponseDto,
} from "./libs/types/types.js";
import { RoutesEntity } from "./routes.entity.js";
import { type RoutesRepository } from "./routes.repository.js";

class RoutesService implements Service {
	private mapboxDirectionApi: MapboxDirectionsApi;
	private pointsOfInterestService: PointsOfInterestService;
	private routesRepository: RoutesRepository;

	public constructor(
		routesRepository: RoutesRepository,
		pointsOfInterestService: PointsOfInterestService,
		mapboxDirectionsApi: MapboxDirectionsApi,
	) {
		this.routesRepository = routesRepository;
		this.pointsOfInterestService = pointsOfInterestService;
		this.mapboxDirectionApi = mapboxDirectionsApi;
	}

	public async construct(
		pointsOfInterest: number[],
	): Promise<RoutesResponseConstructDto> {
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
		payload: RoutesRequestCreateDto,
	): Promise<RoutesResponseDto> {
		await this.ensurePoisExist(payload.pois);

		const formattedPayload = {
			...payload,
			pois: payload.pois.map((id, index) => ({
				id,
				visitOrder: index,
			})),
		};

		const routeEntity = RoutesEntity.initializeNew(formattedPayload);

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

	public async findAll(): Promise<CollectionResult<RoutesResponseDto>> {
		const items = await this.routesRepository.findAll();

		return {
			items: items.map((item) => {
				return item.toObject();
			}),
		};
	}

	public async findById(id: number): Promise<RoutesResponseDto> {
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
		payload: RoutesRequestPatchDto,
	): Promise<RoutesResponseDto> {
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

export { RoutesService };
