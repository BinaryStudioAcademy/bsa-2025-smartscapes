import { createAsyncThunk } from "@reduxjs/toolkit";

import { type APIResponse, type AsyncThunkConfig } from "~/libs/types/types.js";

import {
	type UserPublicProfileResponseDto,
	type UserRouteResponseDto,
} from "../libs/types/types.js";
import { name as sliceName } from "./users.slice.js";

const getUserPublicProfile = createAsyncThunk<
	APIResponse<UserPublicProfileResponseDto>,
	number,
	AsyncThunkConfig
>(`${sliceName}/get-user-public-profile`, (id, { extra }) => {
	const { userApi } = extra;

	return userApi.getProfile(id);
});

const followUser = createAsyncThunk<
	APIResponse<boolean>,
	{ followingId: number; userId: number },
	AsyncThunkConfig
>(`${sliceName}/follow-user`, async ({ followingId, userId }, { extra }) => {
	const { toastNotifier, userApi } = extra;

	const response = await userApi.follow(userId, followingId);

	toastNotifier.showSuccess("You have followed this user");

	return response;
});

const unfollowUser = createAsyncThunk<
	APIResponse<boolean>,
	{ followerId: number; userId: number },
	AsyncThunkConfig
>(`${sliceName}/unfollow-user`, async ({ followerId, userId }, { extra }) => {
	const { toastNotifier, userApi } = extra;

	const response = await userApi.unfollow(userId, followerId);

	toastNotifier.showSuccess("You have unfollowed this user");

	return response;
});

const getActivities = createAsyncThunk<
	APIResponse<UserRouteResponseDto[]>,
	number,
	AsyncThunkConfig
>(`${sliceName}/get-user-activities`, async (id, { extra }) => {
	const { userRouteApi } = extra;

	const response = await userRouteApi.getAllByUserId();

	return response;
});

export { followUser, getActivities, getUserPublicProfile, unfollowUser };
