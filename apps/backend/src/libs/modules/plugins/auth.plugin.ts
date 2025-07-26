import {
	type FastifyInstance,
	type FastifyReply,
	type FastifyRequest,
} from "fastify";
import fastifyPlugin from "fastify-plugin";

import { sendUnathorized } from "~/libs/helpers/helpers.js";
import { type HTTPMethod } from "~/libs/types/types.js";
import { userService } from "~/modules/users/users.js";

import { tokenService } from "../token/token.js";

type PluginOptions = {
	whiteRoutesList: WhiteRoute[];
};

type TokenPayload = {
	userId: number;
};

type WhiteRoute = {
	method: HTTPMethod;
	path: string;
};

const authPlugin = (
	app: FastifyInstance,
	{ whiteRoutesList }: PluginOptions,
): void => {
	const requestHandler = async (
		request: FastifyRequest,
		reply: FastifyReply,
	): Promise<void> => {
		const { headers, method, url } = request;

		const isWhiteListRoute = whiteRoutesList.some(
			({ method: _method, path }) => url.endsWith(path) && _method === method,
		);

		if (isWhiteListRoute) {
			return;
		}

		if (!headers.authorization) {
			sendUnathorized(reply);

			return;
		}

		try {
			const tokenIndex = 1;
			const token = headers.authorization.split(" ")[tokenIndex] as string;
			const { userId } = await tokenService.verify<TokenPayload>(token);
			const user = await userService.findById(userId);

			if (user) {
				request.user = user;
			} else {
				sendUnathorized(reply);
			}
		} catch {
			sendUnathorized(reply);
		}
	};

	app.decorate("user", null);
	app.addHook("onRequest", requestHandler);
};

const fp = fastifyPlugin<PluginOptions>(authPlugin);

export { fp as authPlugin };
