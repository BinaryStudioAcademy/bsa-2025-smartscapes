import { create, getById } from "./actions.js";
import { actions as poiDetailsActions } from "./points-of-interest-details.slice.js";
import { actions } from "./points-of-interest.slice.js";

const allActions = {
	...actions,
	...poiDetailsActions,
	create,
	getById,
};

export { allActions as actions };
export { reducer as pointsOfInterestDetailsReducer } from "./points-of-interest-details.slice.js";
export { reducer as pointOfInterestReducer } from "./points-of-interest.slice.js";
