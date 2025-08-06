import { expect, request, test } from "@playwright/test";
import {
	type APIResponse,
	HTTPCode,
	type UserAuthResponseDto,
	type UserSignInResponseDto,
	type UserSignUpResponseDto,
} from "@smartscapes/shared";

import { ApiControllers } from "../api/controllers/api-controllers.js";
import { authUserSchema } from "../api/schemas/auth-user-schema.js";
import { loginSchema } from "../api/schemas/login-schema.js";
import { signupSchema } from "../api/schemas/signup-schema.js";
import { createRandomUser } from "../helpers/generate-data.js";
import { expectToMatchSchema } from "../helpers/schema-validator.js";

let api: ApiControllers;
let accessToken: string;
let userId: number;

test.beforeAll("Register and login user", async () => {
	let requestContext = await request.newContext();
	api = new ApiControllers(requestContext);

	const user = createRandomUser();
	const registerResponse = await api.auth.register(user);
	const registerBodyResponse =
		(await registerResponse.json()) as APIResponse<UserSignUpResponseDto>;

	expect.soft(registerResponse.status()).toBe(HTTPCode.CREATED);
	expectToMatchSchema(registerBodyResponse, signupSchema);
	accessToken = registerBodyResponse.data.token;

	const loginResponse = await api.auth.login(user.email, user.password);
	const loginBodyResponse =
		(await loginResponse.json()) as APIResponse<UserSignInResponseDto>;

	expect.soft(loginResponse.status()).toBe(HTTPCode.OK);
	expectToMatchSchema(loginBodyResponse, loginSchema);
	accessToken = loginBodyResponse.data.token;
	userId = loginBodyResponse.data.user.id;
});

test("User auth flow chain", async () => {
	await test.step("Get auth user", async () => {
		const response = await api.auth.getAuthenticatedUser(accessToken);
		const body = (await response.json()) as APIResponse<UserAuthResponseDto>;

		expectToMatchSchema(body, authUserSchema);
		expect.soft(response.status()).toBe(HTTPCode.OK);
		expect.soft(body.data.id).toBe(userId);
	});
});
