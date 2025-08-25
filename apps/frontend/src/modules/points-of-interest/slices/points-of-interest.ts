import { create, findAll, getById, patch, remove } from "./actions.js";
import { actions as poiDetailsActions } from "./points-of-interest-details.slice.js";
import { actions as poisActions } from "./points-of-interest.slice.js";

const allActions = {
	...poisActions,
	...poiDetailsActions,
	create,
	findAll,
	getById,
	patch,
	remove,
};

export { allActions as actions };
export { reducer as pointOfInterestDetailsReducer } from "./points-of-interest-details.slice.js";
export { reducer as pointsOfInterestReducer } from "./points-of-interest.slice.js";
