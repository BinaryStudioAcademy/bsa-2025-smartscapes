import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyStatic from "@fastify/static";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify, {
	type FastifyError,
	type FastifyInstance,
	type RouteOptions,
} from "fastify";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { APIErrorType, AppEnvironment } from "~/libs/enums/enums.js";
import { ValidationError } from "~/libs/exceptions/exceptions.js";
import { type Config } from "~/libs/modules/config/config.js";
import { type Database } from "~/libs/modules/database/database.js";
import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	type APIErrorResponse,
	type ValidationSchema,
} from "~/libs/types/types.js";

import { authPlugin, multipartPlugin } from "../plugins/plugins.js";
import { HELMET_CONFIG } from "./libs/constants/constants.js";
import {
	type ServerApplication,
	type ServerApplicationApi,
	type ServerApplicationRouteParameters,
} from "./libs/types/types.js";

type Constructor = {
	apis: ServerApplicationApi[];
	config: Config;
	database: Database;
	logger: Logger;
	title: string;
};

class BaseServerApplication implements ServerApplication {
	private apis: ServerApplicationApi[];

	private app!: FastifyInstance;

	private config: Config;

	private database: Database;

	private logger: Logger;

	private title: string;

	public constructor({ apis, config, database, logger, title }: Constructor) {
		this.apis = apis;
		this.config = config;
		this.database = database;
		this.logger = logger;
		this.title = title;
	}

	public async init(): Promise<void> {
		this.logger.info("Application initialization...");

		this.app = Fastify({
			ignoreTrailingSlash: true,
		});

		this.initValidationCompiler();

		await this.initMiddlewares();

		await this.initServe();

		await this.initPlugins();

		this.initRoutes();

		this.initErrorHandler();

		this.database.connect();

		await this.listenApp();
	}

	private addRoute(parameters: ServerApplicationRouteParameters): void {
		const { handler, method, path, preHandlers, validation } = parameters;

		const routeOptions: RouteOptions = {
			handler,
			method,
			preHandler: preHandlers ?? [],
			url: path,
		};

		if (validation) {
			routeOptions.schema = {
				body: validation.body,
				params: validation.params,
				querystring: validation.query,
				...(validation.body ? { body: validation.body } : {}),
				...(validation.query ? { querystring: validation.query } : {}),
				...(validation.params ? { params: validation.params } : {}),
			};
		}

		this.app.route(routeOptions);

		this.logger.info(`Route registered: ${method} ${path}`);
	}

	private addRoutes(parameters: ServerApplicationRouteParameters[]): void {
		for (let parameter of parameters) {
			this.addRoute(parameter);
		}
	}

	private async initApiDocs(): Promise<void> {
		await Promise.all(
			this.apis.map(async (api) => {
				this.logger.info(
					`Generating swagger documentation for API ${api.version}...`,
				);

				await this.app.register(swagger, {
					mode: "static",
					specification: {
						document: api.generateDoc(this.title),
					},
				});

				await this.app.register(swaggerUi, {
					routePrefix: `${api.basePath}/documentation`,
				});
			}),
		);
	}

	private initErrorHandler(): void {
		this.app.setErrorHandler(
			(error: FastifyError | ValidationError, _request, reply) => {
				if (error instanceof ValidationError) {
					const [issue] = error.issues;
					const message = issue?.message ?? error.message;

					this.logger.error(`[Validation Error]: ${message}`);

					const response: APIErrorResponse = {
						error: {
							details: error.issues.map((issue) => ({
								message: issue.message,
								path: issue.path as (number | string)[],
							})),
							message,
							type: APIErrorType.VALIDATION,
						},
					};

					return reply.status(HTTPCode.UNPROCESSED_ENTITY).send(response);
				}

				if (error instanceof HTTPError) {
					this.logger.error(
						`[HTTP Error]: ${String(error.status)} – ${error.message}`,
					);

					const response: APIErrorResponse = {
						error: {
							message: error.message,
							type: APIErrorType.COMMON,
						},
					};

					return reply.status(error.status).send(response);
				}

				this.logger.error(error.message);

				const response: APIErrorResponse = {
					error: {
						message: error.message,
						type: APIErrorType.COMMON,
					},
				};

				return reply.status(HTTPCode.INTERNAL_SERVER_ERROR).send(response);
			},
		);
	}

	private async initMiddlewares(): Promise<void> {
		if (this.config.ENV.APP.ENVIRONMENT !== AppEnvironment.PRODUCTION) {
			await this.initApiDocs();
		}

		await this.app.register(fastifyCors);

		await this.app.register(fastifyHelmet, HELMET_CONFIG);
	}

	private async initPlugins(): Promise<void> {
		const whiteRoutes = this.apis.flatMap((api) => api.whiteRoutes);
		const { MAX_FILE_SIZE_MB } = this.config.ENV.AWS;

		await this.app.register(authPlugin, { whiteRoutes });
		await this.app.register(multipartPlugin, { MAX_FILE_SIZE_MB });
	}

	private initRoutes(): void {
		const routers = this.apis.flatMap((api) => api.routes);

		this.addRoutes(routers);
	}

	private async initServe(): Promise<void> {
		const staticPath = path.join(
			path.dirname(fileURLToPath(import.meta.url)),
			"../../../../public",
		);

		await this.app.register(fastifyStatic, {
			prefix: "/",
			root: staticPath,
		});

		this.app.setNotFoundHandler(async (_request, response) => {
			await response.sendFile("index.html", staticPath);
		});
	}

	private initValidationCompiler(): void {
		this.app.setValidatorCompiler<ValidationSchema>(({ schema }) => {
			return (data): boolean => {
				const result = schema.parse(data);

				return Boolean(result);
			};
		});
	}

	private async listenApp(): Promise<void> {
		try {
			await this.app.listen({
				host: this.config.ENV.APP.HOST,
				port: this.config.ENV.APP.PORT,
			});

			this.logger.info(
				`Application is listening on PORT – ${this.config.ENV.APP.PORT.toString()}, ENVIRONMENT – ${
					this.config.ENV.APP.ENVIRONMENT
				}.`,
			);
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(error.message, {
					cause: error.cause,
					stack: error.stack,
				});
			}

			throw error;
		}
	}
}

export { BaseServerApplication };
