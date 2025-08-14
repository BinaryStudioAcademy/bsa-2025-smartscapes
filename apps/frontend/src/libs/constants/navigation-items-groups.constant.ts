import { AppRoute, GroupKey, PermissionKey } from "~/libs/enums/enums.js";
import { type NavigationItemsGroup } from "~/libs/types/types.js";

const NAVIGATION_ITEMS_GROUPS: NavigationItemsGroup[] = [
	{
		groupKey: GroupKey.ADMINS,
		hasLabel: true,
		items: [
			{
				href: AppRoute.ROUTES,
				icon: "route",
				label: "Manage routes",
				userPermissions: [PermissionKey.MANAGE_ROUTES],
			},
			{
				href: AppRoute.CATEGORIES,
				icon: "tag",
				label: "Manage categories",
			},
			{
				href: AppRoute.CONTENT,
				icon: "message",
				label: "Content moderation",
			},
		],
		name: "Administration",
	},
	{
		hasLabel: false,
		items: [
			{
				href: AppRoute.APP,
				icon: "dashboard",
				label: "Dashboard",
			},
			{
				href: AppRoute.EXPLORE,
				icon: "map",
				label: "Explore",
			},
			{
				href: AppRoute.PROFILE,
				icon: "user",
				label: "Profile",
			},
		],
		name: "Application",
	},
];

export { NAVIGATION_ITEMS_GROUPS };
