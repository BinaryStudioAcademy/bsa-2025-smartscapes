import { type reducer as authReducer } from "~/modules/auth/auth.js";
import {
	type pointOfInterestReducer,
	type pointsOfInterestDetailsReducer,
} from "~/modules/points-of-interest/points-of-interest.js";
import { type reducer as routeReducer } from "~/modules/routes/routes.js";
import { type reducer as usersReducer } from "~/modules/users/users.js";

type RootReducer = {
	auth: ReturnType<typeof authReducer>;
	pointsOfInterest: ReturnType<typeof pointOfInterestReducer>;
	pointsOfInterestDetails: ReturnType<typeof pointsOfInterestDetailsReducer>;
	route: ReturnType<typeof routeReducer>;
	users: ReturnType<typeof usersReducer>;
};

export { type RootReducer };
