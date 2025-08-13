import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type PointsOfInterestResponseDto } from "~/modules/points-of-interest/points-of-interest.js";

import { loadAll } from "./actions.js";

type State = {
	data: PointsOfInterestResponseDto[];
	dataStatus: ValueOf<typeof DataStatus>;
};

const initialState: State = {
	data: [],
	dataStatus: DataStatus.IDLE,
};

const { actions, name, reducer } = createSlice({
	extraReducers: (builder) => {
		builder
			.addCase(loadAll.fulfilled, (state, action) => {
				state.data = action.payload.data;
				state.dataStatus = DataStatus.FULFILLED;
			})
			.addCase(loadAll.pending, (state) => {
				state.dataStatus = DataStatus.PENDING;
			})
			.addCase(loadAll.rejected, (state) => {
				state.dataStatus = DataStatus.REJECTED;
				state.data = [];
			});
	},
	initialState,
	name: "Points of interest",
	reducers: {},
});

export { actions, name, reducer };
