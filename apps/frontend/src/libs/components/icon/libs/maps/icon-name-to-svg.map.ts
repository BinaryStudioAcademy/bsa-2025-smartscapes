import Analytics from "~/assets/images/icons/analytics.svg?react";
import ArrowDown from "~/assets/images/icons/arrow-down.svg?react";
import Bell from "~/assets/images/icons/bell.svg?react";
import CaretDown from "~/assets/images/icons/caret-down.svg?react";
import CaretUp from "~/assets/images/icons/caret-up.svg?react";
import Close from "~/assets/images/icons/close.svg?react";
import Dashboard from "~/assets/images/icons/dashboard.svg?react";
import Edit from "~/assets/images/icons/edit.svg?react";
import Error from "~/assets/images/icons/error.svg?react";
import EyeOff from "~/assets/images/icons/eye-off.svg?react";
import Eye from "~/assets/images/icons/eye.svg?react";
import Link from "~/assets/images/icons/link.svg?react";
import Logout from "~/assets/images/icons/logout.svg?react";
import Map from "~/assets/images/icons/map.svg?react";
import Message from "~/assets/images/icons/message.svg?react";
import Route from "~/assets/images/icons/route.svg?react";
import Search from "~/assets/images/icons/search.svg?react";
import Tag from "~/assets/images/icons/tag.svg?react";
import Trash from "~/assets/images/icons/trash.svg?react";
import User from "~/assets/images/icons/user.svg?react";
import { type IconName } from "~/libs/types/types.js";

const iconNameToSvg: Record<
	IconName,
	React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
	analytics: Analytics,
	arrowDown: ArrowDown,
	bell: Bell,
	caretDown: CaretDown,
	caretUp: CaretUp,
	close: Close,
	dashboard: Dashboard,
	edit: Edit,
	error: Error,
	eye: Eye,
	eyeOff: EyeOff,
	link: Link,
	logout: Logout,
	map: Map,
	message: Message,
	route: Route,
	search: Search,
	tag: Tag,
	trash: Trash,
	user: User,
};

export { iconNameToSvg };
