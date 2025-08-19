import { type GroupItemWithPermissionsDto } from "~/modules/groups/libs/types/types.js";

type UserPasswordDetails = {
	email: string;
	firstName: string;
	group: GroupItemWithPermissionsDto;
	groupId: number;
	id: number;
	isVisibleProfile: boolean;
	lastName: string;
	passwordHash: string;
	passwordSalt: string;
};

export { type UserPasswordDetails };
