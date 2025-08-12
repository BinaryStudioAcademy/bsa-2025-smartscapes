const checkIsLatinLetter = (value: string): boolean => {
	const latinLettersRegex = /^[a-zA-Z\s]+$/;

	return latinLettersRegex.test(value);
};

export { checkIsLatinLetter };
