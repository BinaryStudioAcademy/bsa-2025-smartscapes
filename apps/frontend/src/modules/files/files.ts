import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { FilesApi } from "./files-api.js";

const filesApi = new FilesApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { filesApi };
