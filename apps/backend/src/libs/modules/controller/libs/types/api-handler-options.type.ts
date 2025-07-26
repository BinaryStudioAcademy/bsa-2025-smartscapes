import { type UserAuthResponseDto } from "~/libs/types/types.js";

type APIHandlerOptions<
	HandlerOptions extends DefaultApiHandlerOptions = DefaultApiHandlerOptions,
> = {
	body: HandlerOptions["body"];
	params: HandlerOptions["params"];
	query: HandlerOptions["query"];
	user?: HandlerOptions["user"] | null;
};

type DefaultApiHandlerOptions = {
	body?: unknown;
	params?: unknown;
	query?: unknown;
	user?: UserAuthResponseDto;
};

export { type APIHandlerOptions };
