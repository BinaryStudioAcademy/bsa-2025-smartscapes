import { faker } from "@faker-js/faker";
import { type UserSignUpRequestDto } from "@smartscapes/shared";

import { NUMBER_2, NUMBER_6, NUMBER_36 } from "../consts/validation-consts.js";

const generateId = (): string =>
	Date.now().toString(NUMBER_36) +
	// eslint-disable-next-line sonarjs/pseudo-random
	Math.random().toString(NUMBER_36).slice(NUMBER_2, NUMBER_36);

const createRandomUser = (): UserSignUpRequestDto => {
	const password = faker.internet.password({ length: NUMBER_6 });

	return {
		confirmPassword: password,
		email: `user${generateId()}@example.com`,
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		password,
	};
};

export { createRandomUser, generateId };
