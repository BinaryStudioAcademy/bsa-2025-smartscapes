import { loadAll, patchProfile } from "./actions.js";
import { actions } from "./users.slice.js";

const allActions = {
	...actions,
	loadAll,
	patchProfile,
};

export { allActions as actions };
export { reducer } from "./users.slice.js";
