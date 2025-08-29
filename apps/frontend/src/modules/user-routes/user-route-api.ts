import { APIPath, ContentType } from "~/libs/enums/enums.js";
import { getUrlWithQueryString } from "~/libs/helpers/helpers.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";
import { type APIResponse } from "~/libs/types/types.js";

import { UserRouteApiPath } from "./libs/enums/enums.js";
import {
	type UserRouteFinishRequestDto,
	type UserRouteGetAllQueryRequestDto,
	type UserRouteQueryRequestDto,
	type UserRouteResponseDto,
} from "./libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class UserRouteApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.USER_ROUTES, storage });
	}

	public async create(
		query: UserRouteQueryRequestDto,
	): Promise<APIResponse<UserRouteResponseDto>> {
		const response = await this.load<APIResponse<UserRouteResponseDto>>(
			this.getFullEndpoint(UserRouteApiPath.CREATE, {}),
			{
				hasAuth: true,
				method: "POST",
				query,
			},
		);

		return await response.json();
	}

	public async deleteRoute(id: number): Promise<APIResponse<boolean>> {
		const response = await this.load<APIResponse<boolean>>(
			this.getFullEndpoint(UserRouteApiPath.$ID, { id: id.toString() }),
			{
				hasAuth: true,
				method: "DELETE",
			},
		);

		return await response.json();
	}

	public async finish(
		payload: UserRouteFinishRequestDto,
		query: UserRouteQueryRequestDto,
	): Promise<APIResponse<UserRouteResponseDto>> {
		const response = await this.load<APIResponse<UserRouteResponseDto>>(
			this.getFullEndpoint(UserRouteApiPath.FINISH, {}),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: "PATCH",
				payload: JSON.stringify(payload),
				query,
			},
		);

		return await response.json();
	}

	public async getAllByUserId(
		query?: UserRouteGetAllQueryRequestDto,
	): Promise<APIResponse<UserRouteResponseDto[]>> {
		const response = await this.load<APIResponse<UserRouteResponseDto[]>>(
			this.getFullEndpoint(UserRouteApiPath.ROOT, {}),
			{
				hasAuth: true,
				method: "GET",
				query,
			},
		);

		return await response.json();
	}

	public async getByRouteId(
		query: UserRouteQueryRequestDto,
	): Promise<APIResponse<UserRouteResponseDto>> {
		const response = await this.load<APIResponse<UserRouteResponseDto>>(
			this.getFullEndpoint(UserRouteApiPath.GET, {}),
			{
				hasAuth: true,
				method: "GET",
				query,
			},
		);

		return await response.json();
	}

	public async saveRoute(
		routeId: number,
	): Promise<APIResponse<UserRouteResponseDto>> {
		const response = await this.load<APIResponse<UserRouteResponseDto>>(
			this.getFullEndpoint(
				getUrlWithQueryString(UserRouteApiPath.CREATE, { routeId }),
				{},
			),
			{
				hasAuth: true,
				method: "POST",
			},
		);

		return await response.json();
	}

	public async start(
		query: UserRouteQueryRequestDto,
	): Promise<APIResponse<UserRouteResponseDto>> {
		const response = await this.load<APIResponse<UserRouteResponseDto>>(
			this.getFullEndpoint(UserRouteApiPath.START, {}),
			{
				hasAuth: true,
				method: "PATCH",
				query,
			},
		);

		return await response.json();
	}
}

export { UserRouteApi };
