import { logger } from "~/libs/modules/logger/logger.js";

import { ReviewController } from "./review.controller.js";
import { ReviewModel } from "./review.model.js";
import { ReviewRepository } from "./review.repository.js";
import { ReviewService } from "./review.service.js";

const reviewRepository = new ReviewRepository(ReviewModel);
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(logger, reviewService);

export { reviewController };
