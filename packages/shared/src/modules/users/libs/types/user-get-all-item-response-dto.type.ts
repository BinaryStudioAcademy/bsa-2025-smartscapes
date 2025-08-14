import { type GroupItemWithPermissionsDto } from "../../../groups/types/types.js";

type UserGetByIdItemResponseDto = {
	email: string;
	firstName: string;
	group: GroupItemWithPermissionsDto;
	groupId: number;
	id: number;
	isVisibleProfile: boolean;
	lastName: string;
};

export { type UserGetByIdItemResponseDto };
