import { METERS_IN_KM } from "~/libs/constants/constants.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import {
	type CollectionResult,
	type PaginationMeta,
	type Service,
} from "~/libs/types/types.js";

import { PointOfInterestExceptionMessage } from "./libs/enums/enums.js";
import { PointOfInterestError } from "./libs/exceptions/exceptions.js";
import {
	type PointsOfInterestCreateRequestDto,
	type PointsOfInterestGetAllItemResponseDto,
	type PointsOfInterestGetAllOptions,
	type PointsOfInterestGetByIdResponseDto,
} from "./libs/types/types.js";
import { PointsOfInterestEntity } from "./points-of-interest.entity.js";
import { type PointsOfInterestRepository } from "./points-of-interest.repository.js";

class PointsOfInterestService implements Service {
	private pointsOfInterestRepository: PointsOfInterestRepository;

	public constructor(pointsOfInterestRepository: PointsOfInterestRepository) {
		this.pointsOfInterestRepository = pointsOfInterestRepository;
	}

	public async create(
		payload: PointsOfInterestCreateRequestDto,
	): Promise<PointsOfInterestGetByIdResponseDto> {
		await this.ensureNameIsUnique(payload.name);

		const { description, location, name } = payload;

		const item = await this.pointsOfInterestRepository.create(
			PointsOfInterestEntity.initializeNew({
				description,
				location,
				name,
			}),
		);

		return item.toDetailsObject();
	}

	public async delete(id: number): Promise<boolean> {
		const poi = await this.pointsOfInterestRepository.findById(id);

		if (!poi) {
			throw new PointOfInterestError({
				message: PointOfInterestExceptionMessage.ID_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		const details = poi.toDetailsObject();

		if (details.routes.length > 0) {
			const [route] = details.routes;
			const { name: routeName } = route as Required<
				(typeof details)["routes"][number]
			>;

			throw new PointOfInterestError({
				message: configureString(
					PointOfInterestExceptionMessage.CANNOT_DELETE_INCLUDED_IN_ROUTE,
					{ routeName },
				),
				status: HTTPCode.BAD_REQUEST,
			});
		}

		const isDeleted = await this.pointsOfInterestRepository.delete(id);

		if (!isDeleted) {
			throw new PointOfInterestError({
				message: PointOfInterestExceptionMessage.ID_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return true;
	}

	public async findAll(
		options: null | PointsOfInterestGetAllOptions,
	): Promise<
		CollectionResult<PointsOfInterestGetAllItemResponseDto, PaginationMeta>
	> {
		const DEFAULT_SEARCH_RADIUS_KM = 5;
		const DEFAULT_PAGE = 1;

		const { page, perPage, radius = DEFAULT_SEARCH_RADIUS_KM } = options ?? {};

		const searchParameters = {
			...options,
			radius: radius * METERS_IN_KM,
		};

		const { items, total } =
			await this.pointsOfInterestRepository.findAll(searchParameters);

		const totalPages = Math.ceil(total / (perPage ?? total));

		return {
			items: items.map((item) => item.toListObject()),
			meta: {
				currentPage: page ?? DEFAULT_PAGE,
				itemsPerPage: perPage ?? total,
				total,
				totalPages,
			},
		};
	}

	public async findById(
		id: number,
	): Promise<PointsOfInterestGetByIdResponseDto> {
		const item = await this.pointsOfInterestRepository.findById(id);

		if (!item) {
			throw new PointOfInterestError({
				message: PointOfInterestExceptionMessage.ID_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return item.toDetailsObject();
	}

	public async patch(
		id: number,
		payload: PointsOfInterestCreateRequestDto,
	): Promise<PointsOfInterestGetByIdResponseDto> {
		const { name } = payload;

		await this.ensureNameIsUnique(name, id);

		const item = await this.pointsOfInterestRepository.patch(id, payload);

		if (!item) {
			throw new PointOfInterestError({
				message: PointOfInterestExceptionMessage.ID_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return item.toDetailsObject();
	}

	private async ensureNameIsUnique(
		name: string,
		currentId?: number,
	): Promise<void> {
		const existingPointOfInterest =
			await this.pointsOfInterestRepository.findByName(name);

		if (
			existingPointOfInterest &&
			existingPointOfInterest.toObject().id !== currentId
		) {
			throw new PointOfInterestError({
				message: PointOfInterestExceptionMessage.NAME_ALREADY_EXISTS,
				status: HTTPCode.CONFLICT,
			});
		}
	}
}

export { PointsOfInterestService };
