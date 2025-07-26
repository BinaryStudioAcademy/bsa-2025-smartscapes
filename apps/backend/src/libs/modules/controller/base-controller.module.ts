import { type Logger } from "~/libs/modules/logger/logger.js";
import { type ServerApplicationRouteParameters } from "~/libs/modules/server-application/server-application.js";

import {
	type APIHandler,
	type APIHandlerOptions,
	type Controller,
	type ControllerRouteParameters,
} from "./libs/types/types.js";

class BaseController implements Controller {
	public routes: ServerApplicationRouteParameters[];

	private apiUrl: string;

	private logger: Logger;

	public constructor(logger: Logger, apiPath: string) {
		this.logger = logger;
		this.apiUrl = apiPath;
		this.routes = [];
	}

	public addRoute<HandlerOptions extends APIHandlerOptions = APIHandlerOptions>(
		options: ControllerRouteParameters<HandlerOptions>,
	): void {
		const { handler, path } = options;
		const fullPath = this.apiUrl + path;

		this.routes.push({
			...options,
			handler: (request, reply) => this.mapHandler(handler, request, reply),
			path: fullPath,
		});
	}

	private async mapHandler<HandlerOptions extends APIHandlerOptions>(
		handler: APIHandler<HandlerOptions>,
		request: Parameters<ServerApplicationRouteParameters["handler"]>[0],
		reply: Parameters<ServerApplicationRouteParameters["handler"]>[1],
	): Promise<void> {
		this.logger.info(
			`Incoming Request: ${request.method.toUpperCase()} ${request.url} [${request.id}]`,
		);

		const handlerOptions = this.mapRequest<HandlerOptions>(request);
		const { payload, status } = await handler(handlerOptions);

		return await reply.status(status).send(payload);
	}

	private mapRequest<HandlerOptions extends APIHandlerOptions>(
		request: Parameters<ServerApplicationRouteParameters["handler"]>[0],
	): HandlerOptions {
		const { body, params, query, user } = request;

		return {
			body,
			params,
			query,
			user,
		} as HandlerOptions;
	}
}

export { BaseController };
