import { HTTPCode } from "~/libs/modules/http/http.js";
import { type CollectionResult, type Service } from "~/libs/types/types.js";
import { ReviewEntity } from "~/modules/reviews/review.entity.js";
import { type ReviewRepository } from "~/modules/reviews/review.repository.js";

import { ReviewExceptionMessage } from "./libs/enums/enums.js";
import { ReviewError } from "./libs/exceptions/exceptions.js";
import {
	type ReviewRequestDto,
	type ReviewResponseDto,
} from "./libs/types/types.js";

class ReviewService implements Service {
	private reviewRepository: ReviewRepository;

	public constructor(reviewRepository: ReviewRepository) {
		this.reviewRepository = reviewRepository;
	}

	public async create(payload: ReviewRequestDto): Promise<ReviewResponseDto> {
		if (!(payload.routeId || payload.poiId)) {
			throw new ReviewError({
				message: ReviewExceptionMessage.ROUTE_OR_POI_REQUIRED,
				status: HTTPCode.BAD_REQUEST,
			});
		}

		if (payload.routeId && payload.poiId) {
			throw new ReviewError({
				message: ReviewExceptionMessage.ROUTE_OR_POI_REQUIRED,
				status: HTTPCode.BAD_REQUEST,
			});
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

	public async findAll(): Promise<CollectionResult<ReviewResponseDto>> {
		const items = await this.reviewRepository.findAll();

		return {
			items: items.map((items) => items.toObject()),
		};
	}
}

export { ReviewService };
