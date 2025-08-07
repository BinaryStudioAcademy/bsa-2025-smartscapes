import { logger } from "~/libs/modules/logger/logger.js";

import { PointsOfInterestController } from "./points-of-interest.controller.js";
import { PointsOfInterestModel } from "./points-of-interest.model.js";
import { PointsOfInterestRepository } from "./points-of-interest.repository.js";
import { PointsOfInterestService } from "./points-of-interest.service.js";

const pointsOfInterestRepository = new PointsOfInterestRepository(
	PointsOfInterestModel,
);
const pointsOfInterestService = new PointsOfInterestService(
	pointsOfInterestRepository,
);
const pointsOfInterestController = new PointsOfInterestController(
	logger,
	pointsOfInterestService,
);

export { pointsOfInterestController, pointsOfInterestService };
