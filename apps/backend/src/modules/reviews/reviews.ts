import { logger } from "~/libs/modules/logger/logger.js";

import { pointsOfInterestService } from "../points-of-interest/points-of-interest.js";
import { routesService } from "../routes/routes.js";
import { ReviewController } from "./review.controller.js";
import { ReviewModel } from "./review.model.js";
import { ReviewRepository } from "./review.repository.js";
import { ReviewService } from "./review.service.js";

const reviewRepository = new ReviewRepository(ReviewModel);
const reviewService = new ReviewService(
	reviewRepository,
	pointsOfInterestService,
	routesService,
);
const reviewController = new ReviewController(logger, reviewService);

export { reviewController };
