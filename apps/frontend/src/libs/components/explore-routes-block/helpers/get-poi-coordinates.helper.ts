import { unwrapResult } from "@reduxjs/toolkit";

import { type useAppDispatch } from "~/libs/hooks/hooks.js";
import { actions as pointsOfInterestActions } from "~/modules/points-of-interest/points-of-interest.js";

const getPOICoordinates = async (
	dispatch: ReturnType<typeof useAppDispatch>,
	id: number,
): Promise<[number, number]> => {
	const action = await dispatch(pointsOfInterestActions.getById(id));

	const result = unwrapResult(action);

	return result.data.location.coordinates;
};

export { getPOICoordinates };
