import swaggerJsdoc from "swagger-jsdoc";

import { AppEnvironment } from "~/libs/enums/enums.js";
import { type Config } from "~/libs/modules/config/config.js";

import {
	type APIDoc as APIDocument,
	type ServerApplicationApi,
	type ServerApplicationApiConstructorParams as ServerApplicationApiConstructorParameters,
	type ServerApplicationRouteParameters,
	type WhiteRoute,
} from "./libs/types/types.js";

class BaseServerApplicationApi implements ServerApplicationApi {
	public basePath: string;

	public routes: ServerApplicationRouteParameters[];

	public version: string;

	public whiteRoutes: WhiteRoute[];

	private config: Config;

	public constructor(
		{
			config,
			version,
			whiteRoutes = [],
		}: ServerApplicationApiConstructorParameters,
		...handlers: [...ServerApplicationRouteParameters[]]
	) {
		this.version = version;
		this.config = config;
		this.basePath = `/api/${this.version}`;

		const swaggerRoute: WhiteRoute = {
			method: "GET",
			path: "/documentation/*",
		};

		const apiRoutes = handlers.map((handler) => ({
			...handler,
			path: `${this.basePath}${handler.path}`,
		}));

		this.routes = apiRoutes;

		this.whiteRoutes = whiteRoutes;

		this.whiteRoutes = [...this.whiteRoutes, swaggerRoute].map(
			(whiteRoute) => ({
				...whiteRoute,
				path: `${this.basePath}${whiteRoute.path}`,
			}),
		);
	}

	public generateDoc(title: string): APIDocument {
		const isLocalEnvironment =
			this.config.ENV.APP.ENVIRONMENT === AppEnvironment.LOCAL;
		const controllerExtension = isLocalEnvironment ? "ts" : "js";

		return swaggerJsdoc({
			apis: [`src/modules/**/*.controller.${controllerExtension}`],
			definition: {
				components: {
					securitySchemes: {
						bearerAuth: {
							bearerFormat: "JWT",
							scheme: "bearer",
							type: "http",
						},
					},
				},
				info: {
					title,
					version: this.version,
				},
				openapi: "3.1.0",
				servers: [{ url: this.basePath }],
			},
			failOnErrors: true,
		}) as APIDocument;
	}
}

export { BaseServerApplicationApi };
