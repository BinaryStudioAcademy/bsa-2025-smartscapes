import { config } from "~/libs/modules/config/config.js";

import { BaseToken } from "./base-token.module.js";

const { JWS_ALGORITHM, JWT_SECRET, TOKEN_EXPIRATION } = config.ENV.AUTH;

const tokenService = new BaseToken({
	jwtAlgorithm: JWS_ALGORITHM,
	jwtSecret: JWT_SECRET,
	tokenExpirationTime: TOKEN_EXPIRATION,
});

export { tokenService };
export { type BaseToken } from "./base-token.module.js";
