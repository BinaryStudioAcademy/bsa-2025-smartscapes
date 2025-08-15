import { createAsyncThunk } from "@reduxjs/toolkit";

import {
	type APIResponse,
	type AsyncThunkConfig,
	type PaginationQuery,
} from "~/libs/types/types.js";
import {
	type PointsOfInterestPaginatedResponseDto,
	type PointsOfInterestRequestDto,
	type PointsOfInterestResponseDto,
} from "~/modules/points-of-interest/points-of-interest.js";

import { name as sliceName } from "./points-of-interest.slice.js";

const create = createAsyncThunk<
	APIResponse<PointsOfInterestResponseDto>,
	PointsOfInterestRequestDto,
	AsyncThunkConfig
>(`${sliceName}/create`, async (payload, { extra }) => {
	const { pointOfInterestApi, toastNotifier } = extra;

	const pointOfInterest = await pointOfInterestApi.create(payload);
	toastNotifier.showSuccess("Point of interest created successfully");

	return pointOfInterest;
});

const findPaginated = createAsyncThunk<
	APIResponse<PointsOfInterestPaginatedResponseDto>,
	PaginationQuery,
	AsyncThunkConfig
>(`${sliceName}/findPaginated`, async (payload, { extra }) => {
	const { pointOfInterestApi } = extra;

	const pointsOfInterest = await pointOfInterestApi.findPaginated(payload);

	return pointsOfInterest;
});

export { create, findPaginated };
