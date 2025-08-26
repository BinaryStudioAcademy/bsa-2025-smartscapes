import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { NotificationApi } from "./notification-api.js";

const notificationApi = new NotificationApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { notificationApi };
export { actions, reducer } from "./slices/notification.js";
