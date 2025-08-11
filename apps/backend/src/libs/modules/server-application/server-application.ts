import { APIPath, AuthApiPath } from "~/libs/enums/enums.js";
import { config } from "~/libs/modules/config/config.js";
import { database } from "~/libs/modules/database/database.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { authController } from "~/modules/auth/auth.js";
import { notificationController } from "~/modules/notifications/notifications.js";
import { pointsOfInterestController } from "~/modules/points-of-interest/points-of-interest.js";
import { reviewController } from "~/modules/reviews/reviews.js";
import { routeCategoryController } from "~/modules/route-categories/route-categories.js";
import { routesController } from "~/modules/routes/routes.js";
import { userFollowsController } from "~/modules/user-follows/user-follows.js";
import { userController } from "~/modules/users/users.js";

import { BaseServerApplicationApi } from "./base-server-application-api.js";
import { BaseServerApplication } from "./base-server-application.js";

const apiV1 = new BaseServerApplicationApi(
	{
		config,
		version: "v1",
		whiteRoutes: [
			{
				method: "POST",
				path: `${APIPath.AUTH}${AuthApiPath.SIGN_UP}`,
			},
			{
				method: "POST",
				path: `${APIPath.AUTH}${AuthApiPath.SIGN_IN}`,
			},
		],
	},
	...authController.routes,
	...notificationController.routes,
	...pointsOfInterestController.routes,
	...reviewController.routes,
	...routeCategoryController.routes,
	...routesController.routes,
	...userController.routes,
	...userFollowsController.routes,
);

const serverApplication = new BaseServerApplication({
	apis: [apiV1],
	config,
	database,
	logger,
	title: "SmartScapes",
});

export { type ServerApplicationRouteParameters } from "./libs/types/types.js";
export { serverApplication };
