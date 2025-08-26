import { logger } from "~/libs/modules/logger/logger.js";
import { mapboxDirectionsApi } from "~/libs/modules/mapbox/mapbox.js";

import { fileService } from "../files/files.js";
import { PlannedPathModel } from "../planned-paths/planned-path.model.js";
import { plannedPathService } from "../planned-paths/planned-paths.js";
import { pointsOfInterestService } from "../points-of-interest/points-of-interest.js";
import { RouteController } from "./route.controller.js";
import { RouteModel } from "./route.model.js";
import { RouteRepository } from "./route.repository.js";
import { RouteService } from "./route.service.js";

const routesRepository = new RouteRepository(RouteModel, PlannedPathModel);
const routeService = new RouteService({
	fileService,
	mapboxDirectionsApi,
	plannedPathService,
	pointsOfInterestService,
	routesRepository,
});
const routeController = new RouteController(logger, routeService);

export { routeController, routeService };
