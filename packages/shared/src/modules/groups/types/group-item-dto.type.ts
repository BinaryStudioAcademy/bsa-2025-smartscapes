import { type PermissionItemDto } from "../../permission/types/types.js";
import { type GroupResponseDto } from "./group-response-dto.type.js";

type GroupItemWithPermissionsDto = GroupResponseDto & {
	permissions: PermissionItemDto[];
};

export { type GroupItemWithPermissionsDto };
