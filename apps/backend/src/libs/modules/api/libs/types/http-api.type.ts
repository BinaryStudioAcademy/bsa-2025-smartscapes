import { type HTTPResponse } from "~/libs/modules/http/http.js";

import { type HTTPApiOptions } from "./types.js";

type HTTPApi = {
	load(
		path: string,
		options: HTTPApiOptions,
		query: Record<string, number | string>,
	): Promise<HTTPResponse>;
};

export { type HTTPApi };
