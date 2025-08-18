import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { getFormattedDate } from "~/libs/helpers/helpers.js";
import { type PaginationMeta, type ValueOf } from "~/libs/types/types.js";
import {
	type PointsOfInterestPaginatedSummary,
	type PointsOfInterestResponseDto,
} from "~/modules/points-of-interest/points-of-interest.js";

import { create, findPaginated } from "./actions.js";

type State = {
	createStatus: ValueOf<typeof DataStatus>;
	data: null | PointsOfInterestResponseDto;
	dataStatus: ValueOf<typeof DataStatus>;
	meta: null | PaginationMeta;
	summary: PointsOfInterestPaginatedSummary[];
};

const initialState: State = {
	createStatus: DataStatus.IDLE,
	data: null,
	dataStatus: DataStatus.IDLE,
	meta: null,
	summary: [],
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(create.pending, (state) => {
			state.createStatus = DataStatus.PENDING;
		});
		builder.addCase(create.fulfilled, (state, { payload }) => {
			state.data = payload.data;
			state.createStatus = DataStatus.FULFILLED;
		});
		builder.addCase(create.rejected, (state) => {
			state.createStatus = DataStatus.REJECTED;
		});

		builder.addCase(findPaginated.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(findPaginated.fulfilled, (state, action) => {
			const { payload } = action;

			state.summary = payload.data.data.map((item) => ({
				...item,
				createdAt: getFormattedDate(item.createdAt, "dd MMM yyyy"),
			}));
			state.meta = payload.data.meta;
			state.dataStatus = DataStatus.FULFILLED;
		});
		builder.addCase(findPaginated.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});
	},
	initialState,
	name: "points-of-interest",
	reducers: {},
});

export { actions, name, reducer };
