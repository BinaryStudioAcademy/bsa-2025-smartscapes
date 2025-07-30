type UserGetByIdItemResponseDto = {
	email: string;
	firstName: string;
	id: number;
	lastName: string;
	passwordHash?: string;
	passwordSalt?: string;
};

export { type UserGetByIdItemResponseDto };
