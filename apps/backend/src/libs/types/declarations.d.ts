import "fastify";

import { type UserAuthResponseDto } from "./types.js";

declare module "fastify" {
	interface FastifyRequest {
		user: null | UserAuthResponseDto;
	}
}
