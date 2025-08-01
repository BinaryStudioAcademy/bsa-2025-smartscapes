import { type Repository } from "~/libs/types/types.js";
import { ReviewEntity } from "~/modules/reviews/review.entity.js";
import { type ReviewModel } from "~/modules/reviews/review.model.js";

class ReviewRepository implements Repository {
	private reviewModel: typeof ReviewModel;

	public constructor(reviewModel: typeof ReviewModel) {
		this.reviewModel = reviewModel;
	}

	public async create(entity: ReviewEntity): Promise<ReviewEntity> {
		const { content, likesCount, poiId, routeId, userId } =
			entity.toNewObject();

		const review = await this.reviewModel
			.query()
			.insert({
				content,
				likesCount,
				poiId,
				routeId,
				userId,
			})
			.returning("*")
			.execute();

		return ReviewEntity.initialize(review);
	}

	public async findAll(): Promise<ReviewEntity[]> {
		const reviews = await this.reviewModel.query().execute();

		return reviews.map((review) => ReviewEntity.initialize(review));
	}
}

export { ReviewRepository };
