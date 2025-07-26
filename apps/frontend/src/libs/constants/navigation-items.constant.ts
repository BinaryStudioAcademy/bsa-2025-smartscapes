import { AppRoute } from "~/libs/enums/enums.js";
import { type NavigationItem } from "~/libs/types/types.js";

const NAVIGATION_ITEMS: NavigationItem[] = [
	{
		href: AppRoute.ROOT,
		icon: "dashboard",
		label: "Dashboard",
	},
	{
		href: AppRoute.SIGN_UP,
		icon: "analytic",
		label: "List of places",
	},
];

export { NAVIGATION_ITEMS };
