import { type GroupItemWithPermissionsDto } from "../../../groups/types/types.js";

type AuthenticatedUserPatchResponseDto = {
	email: string;
	firstName: string;
	group: GroupItemWithPermissionsDto;
	groupId: number;
	id: number;
	lastName: string;
};

export { type AuthenticatedUserPatchResponseDto };
