import {
	type RoutesRequestDto,
	type RoutesResponseDto,
} from "@smartscapes/shared";

import { HTTPCode } from "~/libs/modules/http/http.js";
import { type CollectionResult, type Service } from "~/libs/types/types.js";

import { type PointsOfInterestService } from "../points-of-interest/points-of-interest.service.js";
import { RoutesExceptionMessage } from "./libs/enums/enums.js";
import { RoutesError } from "./libs/exceptions/exceptions.js";
import { RouteEntity } from "./routes.entity.js";
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

	public async create(payload: RoutesRequestDto): Promise<RoutesResponseDto> {
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
		await this.findById(id);

		return await this.routesRepository.delete(id);
	}

	public async findAll(): Promise<
		CollectionResult<{
			description: string;
			id: number;
			name: string;
			pois: { id: number; visitOrder: number }[];
		}>
	> {
		const items = await this.routesRepository.findAll();

		return {
			items: items.map((item) => item.toObject()),
		};
	}

	public async findById(id: number): Promise<RoutesResponseDto> {
		const route = await this.routesRepository.findById(id);

		if (!route) {
			throw new RoutesError({
				message: RoutesExceptionMessage.ROUTE_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return route.toObject();
	}

	public async patch(
		id: number,
		payload: {
			description?: string;
			name?: string;
			pois?: number[];
		},
	): Promise<RoutesResponseDto> {
		await this.findById(id);

		let formattedPayload = {
			description: payload.description,
			name: payload.name,
		} as RoutesResponseDto;

		if (payload.pois) {
			await this.ensurePoisExist(payload.pois);

			formattedPayload.pois = payload.pois.map((id, index) => ({
				id,
				visitOrder: index,
			})) as { id: number; visitOrder: number }[];
		}

		const routeEntity = RouteEntity.initializeNew(formattedPayload);

		const updatedRoute = await this.routesRepository.patch(
			id,
			routeEntity.toObject(),
		);

		return updatedRoute.toObject();
	}

	private async ensurePoisExist(pois: number[]): Promise<void> {
		for (const poiId of pois) {
			try {
				await this.pointsOfInterestService.findById(poiId);
			} catch {
				throw new RoutesError({
					message: RoutesExceptionMessage.POI_NOT_FOUND,
					status: HTTPCode.CONFLICT,
				});
			}
		}
	}
}

export { RoutesService };
