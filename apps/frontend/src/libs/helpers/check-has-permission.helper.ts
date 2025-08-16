import { type PermissionItemDto } from "~/modules/users/libs/types/types.js";

const checkHasPermission = (
	requiredPermissions: string[],
	userPermissions: PermissionItemDto[],
): boolean => {
	if (requiredPermissions.length === 0) {
		return true;
	}

	return requiredPermissions.some((permission) =>
		userPermissions.some((userPermission) => userPermission.key === permission),
	);
};

export { checkHasPermission };
