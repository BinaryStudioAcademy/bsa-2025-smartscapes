import { type FastifyInstance, type FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";

import { type HTTPMethod } from "~/libs/types/types.js";
import { AuthError } from "~/modules/auth/libs/exceptions/exceptions.js";
import { userService } from "~/modules/users/users.js";

import { tokenService } from "../../token/token.js";
import { checkIsWhiteRoute } from "./libs/helpers/helpers.js";

type PluginOptions = {
	whiteRoutes: WhiteRoute[];
};

type TokenPayload = {
	userId: number;
};

type WhiteRoute = {
	method: HTTPMethod;
	path: string;
};

const auth = (app: FastifyInstance, { whiteRoutes }: PluginOptions): void => {
	const requestHandler = async (request: FastifyRequest): Promise<void> => {
		const { headers, url } = request;
		const method = request.method as HTTPMethod;

		const isWhiteListRoute = checkIsWhiteRoute({ method, url, whiteRoutes });

		if (isWhiteListRoute) {
			return;
		}

		if (!headers.authorization) {
			throw new AuthError();
		}

		const [, token] = headers.authorization.split(" ");
		const { userId } = await tokenService.verify<TokenPayload>(token as string);
		const user = await userService.findById(userId);

		if (!user) {
			throw new AuthError();
		}

		request.user = user;
	};

	app.decorateRequest("user", null);
	app.addHook("onRequest", requestHandler);
};

const authPlugin = fastifyPlugin<PluginOptions>(auth);

export { authPlugin, type PluginOptions, type WhiteRoute };
