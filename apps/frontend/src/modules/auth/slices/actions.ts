import { createAsyncThunk } from "@reduxjs/toolkit";

import { type APIResponse, type AsyncThunkConfig } from "~/libs/types/types.js";

import {
	type UserSignInRequestDto,
	type UserSignInResponseDto,
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

const signIn = createAsyncThunk<
	APIResponse<UserSignInResponseDto>,
	UserSignInRequestDto,
	AsyncThunkConfig
>(`${sliceName}/sign-in`, async (payload, { extra }) => {
	const { authApi } = extra;

	const user = await authApi.signIn(payload);

	return user;
});

export { signIn, signUp };
