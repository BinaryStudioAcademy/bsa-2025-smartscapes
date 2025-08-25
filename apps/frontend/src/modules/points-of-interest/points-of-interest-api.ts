import { APIPath, ContentType } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";
import { type APIResponse, type PaginationMeta } from "~/libs/types/types.js";

import { PointsOfInterestApiPath } from "./libs/enums/enums.js";
import {
	type PatchActionPayload,
	type PointsOfInterestCreateRequestDto,
	type PointsOfInterestGetAllItemResponseDto,
	type PointsOfInterestGetAllQuery,
	type PointsOfInterestGetByIdResponseDto,
} from "./libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class PointOfInterestApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.POINTS_OF_INTEREST, storage });
	}

	public async create(
		payload: PointsOfInterestCreateRequestDto,
	): Promise<APIResponse<PointsOfInterestGetByIdResponseDto>> {
		const response = await this.load<
			APIResponse<PointsOfInterestGetByIdResponseDto>
		>(this.getFullEndpoint(PointsOfInterestApiPath.ROOT, {}), {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: "POST",
			payload: JSON.stringify(payload),
		});

		return await response.json();
	}

	public async delete(id: number): Promise<APIResponse<boolean>> {
		const response = await this.load<APIResponse<boolean>>(
			this.getFullEndpoint(PointsOfInterestApiPath.$ID, { id: String(id) }),
			{
				hasAuth: true,
				method: "DELETE",
			},
		);

		return await response.json();
	}

	public async findAll(
		payload: PointsOfInterestGetAllQuery,
	): Promise<
		APIResponse<PointsOfInterestGetAllItemResponseDto[], PaginationMeta>
	> {
		const response = await this.load<
			APIResponse<PointsOfInterestGetAllItemResponseDto[], PaginationMeta>
		>(this.getFullEndpoint(PointsOfInterestApiPath.ROOT, {}), {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: "GET",
			query: payload,
		});

		return await response.json();
	}

	public async getById(
		id: number,
	): Promise<APIResponse<PointsOfInterestGetByIdResponseDto>> {
		const response = await this.load<
			APIResponse<PointsOfInterestGetByIdResponseDto>
		>(this.getFullEndpoint(PointsOfInterestApiPath.ROOT, String(id), {}), {
			hasAuth: false,
			method: "GET",
		});

		return await response.json();
	}

	public async patch({
		id,
		payload,
	}: PatchActionPayload): Promise<
		APIResponse<PointsOfInterestGetByIdResponseDto>
	> {
		const response = await this.load<
			APIResponse<PointsOfInterestGetByIdResponseDto>
		>(
			this.getFullEndpoint(PointsOfInterestApiPath.$ID, { id: id.toString() }),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: "PATCH",
				payload: JSON.stringify(payload),
			},
		);

		return await response.json();
	}
}

export { PointOfInterestApi };
