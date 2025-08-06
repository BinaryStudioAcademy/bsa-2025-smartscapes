import { expect, request, test } from "@playwright/test";
import {
	type APIErrorResponse,
	type APIResponse,
	HTTPCode,
	type UserSignInResponseDto,
} from "@smartscapes/shared";

import { ApiControllers } from "../api/controllers/api-controllers.js";
import { loginSchema } from "../api/schemas/login-schema.js";
import { loginTestDataSet } from "../api/test-data/auth/login-test-data.js";
import { expectToMatchSchema } from "../helpers/schema-validator.js";

let api: ApiControllers;

test.beforeAll("Create API request context for tests", async () => {
	let requestContext = await request.newContext();
	api = new ApiControllers(requestContext);
});

test.describe("Check login", () => {
	for (const { expectedResponse, label, payload } of loginTestDataSet) {
		test(label, async () => {
			const response = await api.auth.login(payload.email, payload.password);

			const responseBody = (await response.json()) as
				| APIErrorResponse
				| APIResponse<UserSignInResponseDto>;

			expect(response.status()).toBe(expectedResponse.status);

			if (response.status() === HTTPCode.CREATED) {
				expectToMatchSchema(responseBody, loginSchema);
			} else {
				expect(expectedResponse.errorMessage).toContain(
					(responseBody as APIErrorResponse).error.message,
				);
			}
		});
	}
});
