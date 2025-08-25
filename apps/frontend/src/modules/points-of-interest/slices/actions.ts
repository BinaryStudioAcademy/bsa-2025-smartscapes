import { createAsyncThunk } from "@reduxjs/toolkit";

import {
	type APIResponse,
	type AsyncThunkConfig,
	type PaginationMeta,
} from "~/libs/types/types.js";

import { PointOfInterestNotification } from "../libs/enums/enums.js";
import {
	type PatchActionPayload,
	type PointsOfInterestCreateRequestDto,
	type PointsOfInterestGetAllItemResponseDto,
	type PointsOfInterestGetAllQuery,
	type PointsOfInterestGetByIdResponseDto,
} from "../libs/types/types.js";
import { name as poiDetailsSliceName } from "./points-of-interest-details.slice.js";
import { name as poiSliceName } from "./points-of-interest.slice.js";

const getById = createAsyncThunk<
	APIResponse<PointsOfInterestGetByIdResponseDto>,
	number,
	AsyncThunkConfig
>(`${poiDetailsSliceName}/load-by-id`, (id, { extra }) => {
	const { pointOfInterestApi } = extra;

	return pointOfInterestApi.getById(id);
});

const create = createAsyncThunk<
	APIResponse<PointsOfInterestGetByIdResponseDto>,
	PointsOfInterestCreateRequestDto,
	AsyncThunkConfig
>(`${poiSliceName}/create`, async (payload, { extra }) => {
	const { pointOfInterestApi, toastNotifier } = extra;

	const pointOfInterest = await pointOfInterestApi.create(payload);
	toastNotifier.showSuccess("Point of interest created successfully");

	return pointOfInterest;
});

const findAll = createAsyncThunk<
	APIResponse<PointsOfInterestGetAllItemResponseDto[], PaginationMeta>,
	PointsOfInterestGetAllQuery,
	AsyncThunkConfig
>(`${poiSliceName}/find-all`, async (payload, { extra }) => {
	const { pointOfInterestApi } = extra;

	const { data, meta } = await pointOfInterestApi.findAll(payload);

	return { data, meta };
});

const patch = createAsyncThunk<
	APIResponse<PointsOfInterestGetByIdResponseDto>,
	PatchActionPayload,
	AsyncThunkConfig
>(`${poiSliceName}/patch-point-of-interest`, async (payload, { extra }) => {
	const { pointOfInterestApi, toastNotifier } = extra;
	const patchResult = await pointOfInterestApi.patch(payload);

	toastNotifier.showSuccess(PointOfInterestNotification.UPDATED);

	return patchResult;
});

const remove = createAsyncThunk<number, number, AsyncThunkConfig>(
	`${poiSliceName}/delete`,
	async (id, { extra }) => {
		const { pointOfInterestApi, toastNotifier } = extra;

		await pointOfInterestApi.delete(id);
		toastNotifier.showSuccess(PointOfInterestNotification.DELETED);

		return id;
	},
);

export { create, findAll, getById, patch, remove };
