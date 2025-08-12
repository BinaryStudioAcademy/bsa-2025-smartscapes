import { type HTTPOptions } from "./http-options.type.js";
import { type HTTPResponse } from "./http-response.type.js";

type HTTP = {
	load<T>(path: string, options: HTTPOptions): Promise<HTTPResponse<T>>;
};

export { type HTTP };
