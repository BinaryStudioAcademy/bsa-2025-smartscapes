import { type NavigationItemsGroup } from "~/libs/types/types.js";
import {
	type GroupResponseDto,
	type PermissionItemDto,
} from "~/modules/users/libs/types/types.js";

import { GroupKey } from "../enums/enums.js";
import { checkHasPermission } from "./helpers.js";

const getPermittedNavigationItems = (
	navigationGroups: NavigationItemsGroup[],
	userGroup: GroupResponseDto | null,
	userPermissions: PermissionItemDto[],
): NavigationItemsGroup[] => {
	return navigationGroups
		.map((group) => ({
			...group,
			items: group.items.filter((item) =>
				checkHasPermission(item.pagePermissions ?? [], userPermissions),
			),
		}))
		.filter((group, index) => {
			if (userGroup?.key === GroupKey.USERS && index === 0) {
				return false;
			}

			return group.items.length > 0;
		});
};

export { getPermittedNavigationItems };
