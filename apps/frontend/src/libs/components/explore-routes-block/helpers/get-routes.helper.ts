import { unwrapResult } from "@reduxjs/toolkit";

import { type useAppDispatch } from "~/libs/hooks/hooks.js";
import { type RouteGetByIdResponseDto } from "~/modules/routes/libs/types/types.js";
import { actions as routesActions } from "~/modules/routes/routes.js";

const getRoutes = async (
	dispatch: ReturnType<typeof useAppDispatch>,
): Promise<RouteGetByIdResponseDto[]> => {
	const action = await dispatch(routesActions.getAll());

	const result = unwrapResult(action);

	return result.data;
};

export { getRoutes };
