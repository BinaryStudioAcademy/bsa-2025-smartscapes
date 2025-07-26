import Analytic from "~/assets/images/icons/analytic.svg?react";
import Dashboard from "~/assets/images/icons/dashboard.svg?react";
import { type IconName } from "~/libs/types/types.js";

const iconNameToSvg: Record<
	IconName,
	React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
	analytic: Analytic,
	dashboard: Dashboard,
};

export { iconNameToSvg };
