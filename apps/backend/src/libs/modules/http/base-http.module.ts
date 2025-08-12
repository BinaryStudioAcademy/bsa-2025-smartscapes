import {
	type HTTP,
	type HTTPOptions,
	type HTTPResponse,
} from "./libs/types/types.js";

class BaseHTTP implements HTTP {
	public load<T = unknown>(
		path: string,
		options: HTTPOptions,
	): Promise<HTTPResponse<T>> {
		const { headers, method, payload } = options;

		return fetch(path, {
			body: payload,
			headers,
			method,
		});
	}
}

export { BaseHTTP };
