import { logger } from "~/libs/modules/logger/logger.js";

import { UserFollowsController } from "./user-follows.controller.js";
import { UserFollowsModel } from "./user-follows.model.js";
import { UserFollowsRepository } from "./user-follows.repository.js";
import { UserFollowsService } from "./user-follows.service.js";

const userFollowsRepository = new UserFollowsRepository(UserFollowsModel);
const userFollowsService = new UserFollowsService(userFollowsRepository);
const userFollowsController = new UserFollowsController(
	logger,
	userFollowsService,
);

export { userFollowsController };
