import { createAsyncThunk } from "@reduxjs/toolkit";

import { StorageKey } from "~/libs/modules/storage/storage.js";
import { type APIResponse, type AsyncThunkConfig } from "~/libs/types/types.js";

import {
	type UserAuthResponseDto,
	type UserSignInRequestDto,
	type UserSignInResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "../libs/types/types.js";
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

const logout = createAsyncThunk<null, undefined, AsyncThunkConfig>(
	`${sliceName}/logout`,
	async (_payload, { extra: { storage } }) => {
		await storage.drop(StorageKey.TOKEN);

		return null;
	},
);

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

export { getAuthenticatedUser, logout, signIn, signUp };
