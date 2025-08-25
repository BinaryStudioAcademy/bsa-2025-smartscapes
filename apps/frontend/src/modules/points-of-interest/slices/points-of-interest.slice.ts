import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type PaginationMeta, type ValueOf } from "~/libs/types/types.js";
import { type PointsOfInterestGetAllItemResponseDto } from "~/modules/points-of-interest/points-of-interest.js";

import { create, findAll, remove } from "./actions.js";

type State = {
	createStatus: ValueOf<typeof DataStatus>;
	data: PointsOfInterestGetAllItemResponseDto[];
	dataStatus: ValueOf<typeof DataStatus>;
	meta: null | PaginationMeta;
};

const initialState: State = {
	createStatus: DataStatus.IDLE,
	data: [],
	dataStatus: DataStatus.IDLE,
	meta: null,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(create.pending, (state) => {
			state.createStatus = DataStatus.PENDING;
		});
		builder.addCase(create.fulfilled, (state) => {
			state.createStatus = DataStatus.FULFILLED;
		});
		builder.addCase(create.rejected, (state) => {
			state.createStatus = DataStatus.REJECTED;
		});

		builder.addCase(findAll.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(findAll.fulfilled, (state, action) => {
			const { payload } = action;

			state.data = payload.data;
			state.meta = payload.meta;
			state.dataStatus = DataStatus.FULFILLED;
		});
		builder.addCase(findAll.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});

		builder.addCase(remove.fulfilled, (state, action) => {
			const { payload } = action;

			state.data = state.data.filter((poi) => poi.id !== payload);

			if (state.meta) {
				state.meta.total -= 1;
			}
		});
	},
	initialState,
	name: "points-of-interest",
	reducers: {},
});

export { actions, name, reducer };
