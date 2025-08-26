import { APIPath } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";
import { type APIResponse } from "~/libs/types/types.js";

import { NotificationApiPath } from "./libs/enums/enums.js";
import { type NotificationGetAllItemResponseDto } from "./libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class NotificationApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.NOTIFICATIONS, storage });
	}

	public async getAll(): Promise<
		APIResponse<{ items: NotificationGetAllItemResponseDto[] }>
	> {
		const response = await this.load<
			APIResponse<{ items: NotificationGetAllItemResponseDto[] }>
		>(this.getFullEndpoint(NotificationApiPath.ROOT, {}), {
			hasAuth: true,
			method: "GET",
		});

		return await response.json();
	}
}

export { NotificationApi };
