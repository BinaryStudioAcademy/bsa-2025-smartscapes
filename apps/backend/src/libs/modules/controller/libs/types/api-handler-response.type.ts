import { type HTTPCode } from "~/libs/modules/http/http.js";
import { type APIResponse, type ValueOf } from "~/libs/types/types.js";

type APIHandlerResponse<Data = null> = {
	payload: Data extends null ? null : APIResponse<Data>;
	status: ValueOf<typeof HTTPCode>;
};

export { type APIHandlerResponse };
