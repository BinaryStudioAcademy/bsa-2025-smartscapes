import { logger } from "~/libs/modules/logger/logger.js";

import { RouteCategoryController } from "./route-category.controller.js";
import { RouteCategoryModel } from "./route-category.model.js";
import { RouteCategoryRepository } from "./route-category.repository.js";
import { RouteCategoryService } from "./route-category.service.js";

const routeCategoryRepository = new RouteCategoryRepository(RouteCategoryModel);
const routeCategoryService = new RouteCategoryService(routeCategoryRepository);
const routeCategoryController = new RouteCategoryController(
	logger,
	routeCategoryService,
);

export { routeCategoryController };
export {
	type RouteCategoryGetAllItemResponseDto,
	type RouteCategoryRequestDto,
} from "./libs/types/types.js";
