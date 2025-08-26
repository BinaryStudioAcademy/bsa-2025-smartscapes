import { type reducer as appReducer } from "~/modules/app/app.js";
import { type reducer as authReducer } from "~/modules/auth/auth.js";
import { type reducer as exploreReducer } from "~/modules/explore/explore.js";
import { type reducer as locationReducer } from "~/modules/location/location.js";
import { type reducer as notificationReducer } from "~/modules/notification/notification.js";
import {
	type pointOfInterestDetailsReducer,
	type pointsOfInterestReducer,
} from "~/modules/points-of-interest/points-of-interest.js";
import {
	type constructRouteReducer,
	type routeDetailsReducer,
	type routesReducer,
} from "~/modules/routes/routes.js";
import { type reducer as usersReducer } from "~/modules/users/users.js";

type RootReducer = {
	app: ReturnType<typeof appReducer>;
	auth: ReturnType<typeof authReducer>;
	constructRoute: ReturnType<typeof constructRouteReducer>;
	explore: ReturnType<typeof exploreReducer>;
	location: ReturnType<typeof locationReducer>;
	notification: ReturnType<typeof notificationReducer>;
	pointOfInterestDetails: ReturnType<typeof pointOfInterestDetailsReducer>;
	pointsOfInterest: ReturnType<typeof pointsOfInterestReducer>;
	routeDetails: ReturnType<typeof routeDetailsReducer>;
	routes: ReturnType<typeof routesReducer>;
	users: ReturnType<typeof usersReducer>;
};

export { type RootReducer };
