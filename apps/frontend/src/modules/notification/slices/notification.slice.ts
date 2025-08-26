import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type NotificationGetAllItemResponseDto } from "../libs/types/types.js";
import { getAll } from "./actions.js";

type State = {
	dataStatus: ValueOf<typeof DataStatus>;
	notifications: NotificationGetAllItemResponseDto[];
};

const initialState: State = {
	dataStatus: DataStatus.IDLE,
	notifications: [],
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(getAll.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(getAll.fulfilled, (state, action) => {
			state.notifications = action.payload.data.items;
			state.dataStatus = DataStatus.FULFILLED;
		});
		builder.addCase(getAll.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});
	},
	initialState,
	name: "notification",
	reducers: {},
});

export { actions, name, reducer };
