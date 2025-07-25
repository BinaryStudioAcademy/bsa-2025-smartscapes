import { createAsyncThunk } from "@reduxjs/toolkit";

import { type APIResponse, type AsyncThunkConfig } from "~/libs/types/types.js";

import {
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "../libs/types/types.js";
import { name as sliceName } from "./auth.slice.js";

const signUp = createAsyncThunk<
	APIResponse<UserSignUpResponseDto>,
	UserSignUpRequestDto,
	AsyncThunkConfig
>(`${sliceName}/sign-up`, async (payload, { extra }) => {
	const { authApi } = extra;

	const user = await authApi.signUp(payload);

	return user;
});

export { signUp };
