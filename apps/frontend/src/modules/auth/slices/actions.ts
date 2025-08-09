import { createAsyncThunk } from "@reduxjs/toolkit";

import { StorageKey } from "~/libs/modules/storage/storage.js";
import { type APIResponse, type AsyncThunkConfig } from "~/libs/types/types.js";
import {
	type UserAuthPatchRequestDto,
	type UserAuthPatchResponseDto,
	type UserAuthResponseDto,
	type UserSignInRequestDto,
	type UserSignInResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/users.js";

import { name as sliceName } from "./auth.slice.js";

const getAuthenticatedUser = createAsyncThunk<
	APIResponse<UserAuthResponseDto> | null,
	undefined,
	AsyncThunkConfig
>(`${sliceName}/authenticated-user`, async (_payload, { extra }) => {
	const { authApi, storage } = extra;

	const hasToken = await storage.has(StorageKey.TOKEN);

	if (!hasToken) {
		return null;
	}

	const user = await authApi.getAuthenticatedUser();

	return user;
});

const signUp = createAsyncThunk<
	APIResponse<UserSignUpResponseDto>,
	UserSignUpRequestDto,
	AsyncThunkConfig
>(`${sliceName}/sign-up`, async (payload, { extra }) => {
	const { authApi, storage } = extra;

	const user = await authApi.signUp(payload);
	const { token } = user.data;
	await storage.set(StorageKey.TOKEN, token);

	return user;
});

const signIn = createAsyncThunk<
	APIResponse<UserSignInResponseDto>,
	UserSignInRequestDto,
	AsyncThunkConfig
>(`${sliceName}/sign-in`, async (payload, { extra }) => {
	const { authApi, storage } = extra;

	const user = await authApi.signIn(payload);
	const { token } = user.data;
	await storage.set(StorageKey.TOKEN, token);

	return user;
});

const patchAuthenticatedUser = createAsyncThunk<
	APIResponse<UserAuthPatchResponseDto>,
	UserAuthPatchRequestDto,
	AsyncThunkConfig
>(`${sliceName}/patch`, async (payload, { extra, getState }) => {
	const { authApi } = extra;
	const state = getState();

	const userId = state.auth.authenticatedUser?.id as number;

	return await authApi.patch(userId, payload);
});

export { getAuthenticatedUser, patchAuthenticatedUser, signIn, signUp };
