import { APIErrorType } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import {
	type HTTP,
	HTTPClientError,
	type HTTPCode,
	HTTPHeader,
	type HTTPResponse,
} from "~/libs/modules/http/http.js";
import { type APIErrorResponse, type ValueOf } from "~/libs/types/types.js";

import {
	type GetHeadersOptions,
	type HTTPApi,
	type HTTPApiOptions,
} from "./libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	path: string;
};

class BaseHTTPApi implements HTTPApi {
	private baseUrl: string;

	private http: HTTP;

	private path: string;

	public constructor({ baseUrl, http, path }: Constructor) {
		this.baseUrl = baseUrl;
		this.http = http;
		this.path = path;
	}

	public async load<T = unknown>(
		path: string,
		options: HTTPApiOptions,
	): Promise<HTTPResponse<T>> {
		const { contentType = null, method, payload = null, query } = options;

		const headers = this.getHeaders({
			contentType,
		});

		const queryString = query ? new URLSearchParams(query) : null;
		const url = queryString ? `${path}?${queryString}` : path;
		const response = await this.http.load<T>(url, {
			headers,
			method,
			payload,
		});

		return await this.checkResponse<T>(response);
	}

	protected getFullEndpoint<T extends Record<string, string>>(
		...parameters: [...string[], T]
	): string {
		const copiedParameters = [...parameters];

		const options = copiedParameters.pop() as T;

		return configureString(
			this.baseUrl,
			this.path,
			...(copiedParameters as string[]),
			options,
		);
	}

	private async checkResponse<T>(
		response: HTTPResponse<T>,
	): Promise<HTTPResponse<T>> {
		if (!response.ok) {
			await this.handleError(response);
		}

		return response;
	}

	private getHeaders({ contentType }: GetHeadersOptions): Headers {
		const headers = new Headers();

		if (contentType) {
			headers.append(HTTPHeader.CONTENT_TYPE, contentType);
		}

		return headers;
	}

	private async handleError(response: HTTPResponse): Promise<never> {
		let errorPayload: APIErrorResponse["error"];

		try {
			const body = (await response.json()) as APIErrorResponse;

			const commonErrorPayload = {
				message: response.statusText,
				type: APIErrorType.COMMON,
			};

			errorPayload = "error" in body ? body.error : commonErrorPayload;
		} catch {
			errorPayload = {
				message: response.statusText,
				type: APIErrorType.COMMON,
			};
		}

		const details = "details" in errorPayload ? errorPayload.details : [];

		throw new HTTPClientError({
			details,
			message: errorPayload.message,
			status: response.status as ValueOf<typeof HTTPCode>,
			type: errorPayload.type,
		});
	}
}

export { BaseHTTPApi };
