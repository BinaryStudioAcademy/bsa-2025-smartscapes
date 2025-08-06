import { expect, request, test } from "@playwright/test";
import {
	type APIErrorResponse,
	type APIResponse,
	HTTPCode,
	type UserSignInResponseDto,
} from "@smartscapes/shared";

import { ApiControllers } from "../api/controllers/api-controllers.js";
import { signupSchema } from "../api/schemas/signup-schema.js";
import { signupTestDataSet } from "../api/test-data/auth/register-test-data.js";
import { expectToMatchSchema } from "../helpers/schema-validator.js";

let api: ApiControllers;

test.beforeAll("Create context", async () => {
	let requestContext = await request.newContext();
	api = new ApiControllers(requestContext);
});

test.describe("Check register", () => {
	for (const { expectedResponse, label, payload } of signupTestDataSet) {
		test(label, async () => {
			const response = await api.auth.register(payload);

			const responseBody = (await response.json()) as
				| APIErrorResponse
				| APIResponse<UserSignInResponseDto>;

			expect(response.status()).toBe(expectedResponse.status);

			if (response.status() === HTTPCode.CREATED) {
				expectToMatchSchema(responseBody, signupSchema);
			} else {
				expect(expectedResponse.errorMessages).toContain(
					(responseBody as APIErrorResponse).error.message,
				);
			}
		});
	}
});
