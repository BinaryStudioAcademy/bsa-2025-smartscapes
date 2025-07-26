import { createSlice } from "@reduxjs/toolkit";
import { type UserAuthResponseDto } from "@smartscapes/shared";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { signIn, signUp } from "./actions.js";

type State = {
	authenticatedUser: null | UserAuthResponseDto;
	dataStatus: ValueOf<typeof DataStatus>;
};

const initialState: State = {
	authenticatedUser: null,
	dataStatus: DataStatus.IDLE,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(signUp.fulfilled, (state) => {
			state.dataStatus = DataStatus.FULFILLED;
		});
		builder.addCase(signUp.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(signUp.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});

		builder.addCase(signIn.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(signIn.fulfilled, (state, action) => {
			state.authenticatedUser = action.payload.data.user;
			state.dataStatus = DataStatus.FULFILLED;
		});
		builder.addCase(signIn.rejected, (state) => {
			state.authenticatedUser = null;
			state.dataStatus = DataStatus.REJECTED;
		});
	},
	initialState,
	name: "auth",
	reducers: {},
});

export { actions, name, reducer };
