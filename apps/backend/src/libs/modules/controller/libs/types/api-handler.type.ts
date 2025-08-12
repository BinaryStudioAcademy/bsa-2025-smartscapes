import { type APIHandlerOptions } from "./api-handler-options.type.js";
import { type APIHandlerResponse } from "./api-handler-response.type.js";

type APIHandler<
	HandlerOptions extends APIHandlerOptions = APIHandlerOptions,
	HandlerResponse = unknown,
> = (
	options: HandlerOptions,
) =>
	| APIHandlerResponse<HandlerResponse>
	| Promise<APIHandlerResponse<HandlerResponse>>;

export { type APIHandler };
