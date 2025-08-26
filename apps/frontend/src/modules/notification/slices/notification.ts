import { getAll } from "./actions.js";
import { actions } from "./notification.slice.js";

const allActions = {
	...actions,
	getAll,
};

export { allActions as actions };
export { reducer } from "./notification.slice.js";
