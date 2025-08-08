import { type HTTPMethod } from "~/libs/modules/http/http.js";
import { type ServerApplicationRouteParameters } from "~/libs/modules/server-application/server-application.js";
import { type ValidationSchema } from "~/libs/types/types.js";

import { type APIHandlerOptions } from "./api-handler-options.type.js";
import { type APIHandler } from "./api-handler.type.js";

type ControllerRouteParameters<
	HandlerOptions extends APIHandlerOptions = APIHandlerOptions,
> = {
	handler: APIHandler<HandlerOptions>;
	method: HTTPMethod;
	path: string;
	preHandlers?: ServerApplicationRouteParameters["preHandlers"];
	validation?: {
		body?: ValidationSchema;
		query?: ValidationSchema;
	};
};

export { type ControllerRouteParameters };
