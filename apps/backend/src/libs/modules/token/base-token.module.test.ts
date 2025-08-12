import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { type Config } from "~/libs/modules/config/config.js";
import { type EnvironmentSchema } from "~/libs/modules/config/libs/types/types.js";

import { BaseToken } from "./base-token.module.js";

describe("Token service", () => {
	const mockENV: Pick<EnvironmentSchema, "AUTH"> = {
		AUTH: {
			JWS_ALGORITHM: "HS384",
			JWT_SECRET: "mock secret",
			TOKEN_EXPIRATION: "1h",
		},
	};

	const resourceId = 1;

	const mockConfig = {
		ENV: mockENV as Config["ENV"],
	} as Config;

	const { JWS_ALGORITHM, JWT_SECRET, TOKEN_EXPIRATION } = mockConfig.ENV.AUTH;

	it("create should return token", async () => {
		const tokenService = new BaseToken({
			jwtAlgorithm: JWS_ALGORITHM,
			jwtSecret: JWT_SECRET,
			tokenExpirationTime: TOKEN_EXPIRATION,
		});

		const token = await tokenService.create({ id: resourceId });

		const payload = await tokenService.verify(token);

		assert.equal(payload["id"], resourceId);
	});

	it("verify should throw error if token is invalid", async () => {
		const tokenService = new BaseToken({
			jwtAlgorithm: JWS_ALGORITHM,
			jwtSecret: JWT_SECRET,
			tokenExpirationTime: TOKEN_EXPIRATION,
		});

		const invalidToken = "invalid token";

		try {
			await tokenService.verify(invalidToken);
			assert.fail("expected exception not thrown");
		} catch (error) {
			assert.ok(error instanceof Error);
		}
	});
});
