import Analytics from "~/assets/images/icons/analytics.svg?react";
import ArrowDown from "~/assets/images/icons/arrow-down.svg?react";
import Dashboard from "~/assets/images/icons/dashboard.svg?react";
import Error from "~/assets/images/icons/error.svg?react";
import EyeOff from "~/assets/images/icons/eye-off.svg?react";
import Eye from "~/assets/images/icons/eye.svg?react";
import Map from "~/assets/images/icons/map.svg?react";
import Message from "~/assets/images/icons/message.svg?react";
import Route from "~/assets/images/icons/route.svg?react";
import Tag from "~/assets/images/icons/tag.svg?react";
import User from "~/assets/images/icons/user.svg?react";
import { type IconName } from "~/libs/types/types.js";

const iconNameToSvg: Record<
	IconName,
	React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
	analytics: Analytics,
	arrowDown: ArrowDown,
	dashboard: Dashboard,
	error: Error,
	eye: Eye,
	eyeOff: EyeOff,
	map: Map,
	message: Message,
	route: Route,
	tag: Tag,
	user: User,
};

export { iconNameToSvg };
