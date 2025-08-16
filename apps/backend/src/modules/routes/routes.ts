import { logger } from "~/libs/modules/logger/logger.js";
import { mapboxDirectionsApi } from "~/libs/modules/mapbox/mapbox.js";

import { plannedPathService } from "../planned-routes/planned-paths.js";
import { pointsOfInterestService } from "../points-of-interest/points-of-interest.js";
import { RouteController } from "./route.controller.js";
import { RouteModel } from "./route.model.js";
import { RouteRepository } from "./route.repository.js";
import { RouteService } from "./route.service.js";

const routesRepository = new RouteRepository(RouteModel);
const routeService = new RouteService({
	mapboxDirectionsApi,
	plannedPathService,
	pointsOfInterestService,
	routesRepository,
});
const routeController = new RouteController(logger, routeService);

export { routeController, routeService };
