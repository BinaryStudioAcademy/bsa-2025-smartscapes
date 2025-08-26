import { createAsyncThunk } from "@reduxjs/toolkit";

import { type APIResponse, type AsyncThunkConfig } from "~/libs/types/types.js";

import { type NotificationGetAllItemResponseDto } from "../libs/types/types.js";
import { name as sliceName } from "./notification.slice.js";

const getAll = createAsyncThunk<
	APIResponse<{ items: NotificationGetAllItemResponseDto[] }>,
	undefined,
	AsyncThunkConfig
>(`${sliceName}/get-all`, async (_, { extra }) => {
	const { notificationApi } = extra;

	return await notificationApi.getAll();
});

export { getAll };
