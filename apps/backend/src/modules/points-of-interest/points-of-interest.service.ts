import { HTTPCode } from "~/libs/modules/http/http.js";
import { type CollectionResult, type Service } from "~/libs/types/types.js";
import { PointsOfInterestEntity } from "~/modules/points-of-interest/points-of-interest.entity.js";
import { type PointsOfInterestRepository } from "~/modules/points-of-interest/points-of-interest.repository.js";

import { PointOfInterestExceptionMessage } from "./libs/enums/enums.js";
import { PointOfInterestError } from "./libs/exceptions/exceptions.js";
import {
	type PointsOfInterestRequestDto,
	type PointsOfInterestResponseDto,
} from "./libs/types/type.js";

class PointsOfInterestService implements Service {
	private pointsOfInterestRepository: PointsOfInterestRepository;

	public constructor(pointsOfInterestRepository: PointsOfInterestRepository) {
		this.pointsOfInterestRepository = pointsOfInterestRepository;
	}

	public async create(
		payload: PointsOfInterestRequestDto,
	): Promise<PointsOfInterestResponseDto> {
		await this.ensureNameIsUnique(payload.name);

		const { name } = payload;

		const item = await this.pointsOfInterestRepository.create(
			PointsOfInterestEntity.initializeNew({
				name,
			}),
		);

		return item.toObject();
	}

	public async delete(id: number): Promise<boolean> {
		const isDeleted = await this.pointsOfInterestRepository.delete(id);

		if (!isDeleted) {
			throw new PointOfInterestError({
				message: PointOfInterestExceptionMessage.ID_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return true;
	}

	public async findAll(): Promise<
		CollectionResult<PointsOfInterestResponseDto>
	> {
		const items = await this.pointsOfInterestRepository.findAll();

		return {
			items: items.map((item) => {
				return item.toObject();
			}),
		};
	}

	public async findById(id: number): Promise<PointsOfInterestResponseDto> {
		const item = await this.pointsOfInterestRepository.findById(id);

		if (!item) {
			throw new PointOfInterestError({
				message: PointOfInterestExceptionMessage.ID_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return item.toObject();
	}

	public async patch(
		id: number,
		payload: PointsOfInterestRequestDto,
	): Promise<PointsOfInterestResponseDto> {
		const { name } = payload;

		await this.ensureNameIsUnique(name);

		const item = await this.pointsOfInterestRepository.patch(
			id,
			PointsOfInterestEntity.initializeNew({
				name,
			}),
		);

		if (!item) {
			throw new PointOfInterestError({
				message: PointOfInterestExceptionMessage.ID_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return item.toObject();
	}

	private async ensureNameIsUnique(name: string): Promise<void> {
		const existingPointOfInterest =
			await this.pointsOfInterestRepository.findByName(name);

		if (existingPointOfInterest) {
			throw new PointOfInterestError({
				message: PointOfInterestExceptionMessage.NAME_ALREADY_EXISTS,
				status: HTTPCode.CONFLICT,
			});
		}
	}
}

export { PointsOfInterestService };
