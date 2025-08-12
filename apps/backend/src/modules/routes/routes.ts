import { logger } from "~/libs/modules/logger/logger.js";
import { mapboxDirectionsApi } from "~/libs/modules/mapbox/mapbox.js";

import { pointsOfInterestService } from "../points-of-interest/points-of-interest.js";
import { RoutesController } from "./routes.controller.js";
import { RoutesModel } from "./routes.model.js";
import { RoutesRepository } from "./routes.repository.js";
import { RoutesService } from "./routes.service.js";

const routesRepository = new RoutesRepository(RoutesModel);
const routesService = new RoutesService(
	routesRepository,
	pointsOfInterestService,
	mapboxDirectionsApi,
);
const routesController = new RoutesController(logger, routesService);

export { routesController, routesService };
