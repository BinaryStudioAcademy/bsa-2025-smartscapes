const getUserInitials = (firstName: string, lastName: string): string => {
	const [firstChar] = firstName;
	const [lastChar] = lastName;

	const firstNameInitial = firstChar ? firstChar.toUpperCase() : "";
	const lastNameInitial = lastChar ? lastChar.toUpperCase() : "";

	return `${firstNameInitial}${lastNameInitial}`;
};

export { getUserInitials };
