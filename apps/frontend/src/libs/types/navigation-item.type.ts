import { type AppRoute } from "~/libs/enums/enums.js";
import { type IconName, type ValueOf } from "~/libs/types/types.js";

type NavigationItem = {
	href: ValueOf<typeof AppRoute>;
	icon: IconName;
	isLabelHidden?: boolean;
	label: string;
};

export { type NavigationItem };
