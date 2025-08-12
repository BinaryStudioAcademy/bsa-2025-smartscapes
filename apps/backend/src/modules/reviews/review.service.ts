import { type CollectionResult, type Service } from "~/libs/types/types.js";
import { ReviewEntity } from "~/modules/reviews/review.entity.js";
import { type ReviewRepository } from "~/modules/reviews/review.repository.js";

import { type PointsOfInterestService } from "../points-of-interest/points-of-interest.service.js";
import { type RoutesService } from "../routes/routes.service.js";
import {
	type ReviewCreatePayload,
	type ReviewGetByIdResponseDto,
} from "./libs/types/types.js";

class ReviewService implements Service {
	private pointsOfInterestService: PointsOfInterestService;
	private reviewRepository: ReviewRepository;
	private routesService: RoutesService;

	public constructor(
		reviewRepository: ReviewRepository,
		pointsOfInterestService: PointsOfInterestService,
		routesService: RoutesService,
	) {
		this.pointsOfInterestService = pointsOfInterestService;
		this.reviewRepository = reviewRepository;
		this.routesService = routesService;
	}

	public async create(
		payload: ReviewCreatePayload,
	): Promise<ReviewGetByIdResponseDto> {
		if (payload.poiId) {
			await this.ensurePoiExists(payload.poiId);
		}

		if (payload.routeId) {
			await this.ensureRouteExists(payload.routeId);
		}

		const reviewEntity = ReviewEntity.initializeNew({
			content: payload.content,
			likesCount: 0,
			poiId: payload.poiId ?? null,
			routeId: payload.routeId ?? null,
			userId: payload.userId,
		});

		const item = await this.reviewRepository.create(reviewEntity);

		return item.toObject();
	}

	public async findAll(): Promise<CollectionResult<ReviewGetByIdResponseDto>> {
		const items = await this.reviewRepository.findAll();

		return {
			items: items.map((items) => items.toObject()),
		};
	}

	private async ensurePoiExists(id: number): Promise<void> {
		await this.pointsOfInterestService.findById(id);
	}

	private async ensureRouteExists(id: number): Promise<void> {
		await this.routesService.findById(id);
	}
}

export { ReviewService };
