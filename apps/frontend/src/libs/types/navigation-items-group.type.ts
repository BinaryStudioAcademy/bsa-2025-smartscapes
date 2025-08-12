import { type NavigationItem } from "./navigation-item.type.js";

type NavigationItemsGroup = {
	hasLabel: boolean;
	items: NavigationItem[];
	name: string;
};

export { type NavigationItemsGroup };
