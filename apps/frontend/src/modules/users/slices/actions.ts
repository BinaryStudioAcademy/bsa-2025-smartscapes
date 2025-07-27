import { createAsyncThunk } from "@reduxjs/toolkit";

import { type APIResponse, type AsyncThunkConfig } from "~/libs/types/types.js";
import { type UserItemResponseDto } from "~/modules/users/users.js";

import { name as sliceName } from "./users.slice.js";

const loadAll = createAsyncThunk<
	APIResponse<UserItemResponseDto[]>,
	undefined,
	AsyncThunkConfig
>(`${sliceName}/load-all`, (_, { extra }) => {
	const { userApi } = extra;

	return userApi.getAll();
});

export { loadAll };
