import { type HTTPMethod } from "~/libs/modules/http/http.js";
import { type ValidationSchema } from "~/libs/types/types.js";

import { type APIHandlerOptions } from "./api-handler-options.type.js";
import { type APIHandler } from "./api-handler.type.js";
import { type APIPreHandler } from "./api-pre-handler.type.js";

type ControllerRouteParameters<
	HandlerOptions extends APIHandlerOptions = APIHandlerOptions,
> = {
	handler: APIHandler<HandlerOptions>;
	method: HTTPMethod;
	path: string;
	preHandlers?: APIPreHandler[];
	validation?: {
		body?: ValidationSchema;
		params?: ValidationSchema;
		query?: ValidationSchema;
	};
};

export { type ControllerRouteParameters };
