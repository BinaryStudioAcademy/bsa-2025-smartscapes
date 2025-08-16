import { HTTPCode } from "~/libs/modules/http/http.js";
import { type MapboxConstructRouteResponseDto } from "~/libs/modules/mapbox/libs/types/types.js";

import { PlannedPathExceptionMessage } from "./libs/enums/enums.js";
import { PlannedPathError } from "./libs/exceptions/exceptions.js";
import { type PlannedPathResponseDto } from "./libs/types/types.js";
import { PlannedPathEntity } from "./planned-path.entity.js";
import { type PlannedPathRepository } from "./planned-path.repository.js";

class PlannedPathService {
	private plannedPathRepository: PlannedPathRepository;

	public constructor(plannedPathRepository: PlannedPathRepository) {
		this.plannedPathRepository = plannedPathRepository;
	}

	public async create(
		payload: MapboxConstructRouteResponseDto,
	): Promise<PlannedPathResponseDto> {
		const { distance, duration, geometry } = payload.route;

		const plannedRouteEntity = PlannedPathEntity.initializeNew({
			distance,
			duration,
			geometry,
		});

		const plannedRoute =
			await this.plannedPathRepository.create(plannedRouteEntity);

		return plannedRoute.toObject();
	}

	public async delete(id: number): Promise<boolean> {
		const isDeleted = await this.plannedPathRepository.delete(id);

		return isDeleted;
	}

	public async findById(id: number): Promise<PlannedPathResponseDto> {
		const plannedRoute = await this.plannedPathRepository.findById(id);

		if (!plannedRoute) {
			throw new PlannedPathError({
				message: PlannedPathExceptionMessage.PLANNED_PATH_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return plannedRoute.toObject();
	}
}

export { PlannedPathService };
