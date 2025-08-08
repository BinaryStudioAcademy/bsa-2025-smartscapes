import { type GroupItemWithPermissionsDto } from "~/modules/groups/libs/types/types.js";

type UserPasswordDetails = {
	firstName: string;
	group: GroupItemWithPermissionsDto;
	groupId: number;
	id: number;
	lastName: string;
	passwordHash: string;
	passwordSalt: string;
};

export { type UserPasswordDetails };
