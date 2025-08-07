import {
	type RoutesRequestCreateDto,
	type RoutesRequestPatchDto,
	type RoutesResponseDto,
} from "@smartscapes/shared";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { type CollectionResult, type Service } from "~/libs/types/types.js";

import { type PointsOfInterestService } from "../points-of-interest/points-of-interest.service.js";
import { RoutesExceptionMessage } from "./libs/enums/enums.js";
import { RoutesError } from "./libs/exceptions/exceptions.js";
import { RoutesEntity } from "./routes.entity.js";
import { type RoutesRepository } from "./routes.repository.js";

class RoutesService implements Service {
	private pointsOfInterestService: PointsOfInterestService;
	private routesRepository: RoutesRepository;

	public constructor(
		routesRepository: RoutesRepository,
		pointsOfInterestService: PointsOfInterestService,
	) {
		this.routesRepository = routesRepository;
		this.pointsOfInterestService = pointsOfInterestService;
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
