import { type CollectionResult, type Service } from "~/libs/types/types.js";
import { ReviewEntity } from "~/modules/reviews/review.entity.js";
import { type ReviewRepository } from "~/modules/reviews/review.repository.js";

import {
	type ReviewCreatePayload,
	type ReviewGetByIdResponseDto,
} from "./libs/types/types.js";

class ReviewService implements Service {
	private reviewRepository: ReviewRepository;

	public constructor(reviewRepository: ReviewRepository) {
		this.reviewRepository = reviewRepository;
	}

	public async create(
		payload: ReviewCreatePayload,
	): Promise<ReviewGetByIdResponseDto> {
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
}

export { ReviewService };
